#!/usr/bin/env node

var Q        = require('q');
var fs       = require('fs');
var open     = require('open');
var events   = require('events');
var https    = require('https');
var libapi   = require('./api');
var libdata  = require('./data');
var termMenu = require('terminal-menu-2');
var exec     = require('child_process').exec;
var spawn    = require('child_process').spawn;

var OPTIONS  = require('./getopts');
var isWin32  = process.platform === 'win32';
var COLUMNS  = process.stdout.columns || 80;
var ROWS     = process.stdout.rows || 24;
var colMax   = COLUMNS - 4;
var rowMax   = ROWS - 2;

var MENU, OFFSET = 0, RUNNING = {}, ITEMS = [], HASH;
var INDICATOR_ON = ' ◉ ', INDICATOR_OFF = ' ◯ ';
var VIDEO_TO_START = 'Play this video in ' + OPTIONS.f;
var VIDEO_TO_STOP = 'Stop this video';

// the last line of Windows' CMD window always is empty and in input state
if (isWin32) rowMax -= 1;

Q().
then(function() {
  ITEMS = libdata.readCache('subscriptions');
  HASH = libdata.readCache('hash');
  makeMenu();
}).
then(function() {
  return libdata.checkCookie();
}).
then(function(cookie) {
  if (!MENU) process.stdout.write('Retrieving list of videos ... ');
  var pagesNeeded = OPTIONS.p;
  return libapi.subscription.get(serial(pagesNeeded), cookie);
}).
then(function(data) {
  var hash = cacheHash(data);
  libdata.saveCache(data, 'subscriptions');
  libdata.saveCache(hash, 'hash');
  ITEMS = data;
  if (HASH !== hash) {     // if there are new videos, update menu
    if (!MENU || !MENU.detailsPage) { // update menu if we are not on details page
      makeMenu();
    }
  }
}).
catch(function(err) {
  error(err);
});

// events

var ytEvents = new events.EventEmitter();

ytEvents.on('start', function(index) {
  var url = ITEMS[index + OFFSET].url;
  if (MENU.detailsPage) {
    if (MENU.items[0].label === VIDEO_TO_STOP) {
      return killall(RUNNING[url].pid);
    }
    MENU.items[0].label = VIDEO_TO_STOP;
    MENU._drawRow(0);
  } else {
    if (MENU.items[index].label.slice(0, 3) === INDICATOR_ON) {
      return killall(RUNNING[url].pid);
    }
    MENU.items[index].label = INDICATOR_ON + MENU.items[index].label.slice(3);
    MENU._drawRow(index);
  }
  // use --player-no-close to prevent video player exiting too early
  // vlc's --play-and-exit option does not work in Mac OS X
  // so we use verbose stderr to see when the video really ends
  var livestreamer = spawn('livestreamer', [
    '--player-no-close',
    url, OPTIONS.f,
    '--player-args', '--video-on-top {filename} --verbose 2',
    '--verbose-player'
  ]);
  livestreamer.stderr.on('data', function(chunk) {
    if (chunk.toString().indexOf('finished input') > -1) {
      if (!RUNNING[url]) return;
      killall(RUNNING[url].pid);
    }
  });
  livestreamer.on('error', function(e) {
    error('Make sure you have access to command `livestreamer`.');
  });
  livestreamer.on('exit', function() {
    ytEvents.emit('end', url);
  });
  RUNNING[url] = livestreamer;
});

ytEvents.on('end', function(url) {
  var index = -1;
  for (var i = 0; i < ITEMS.length; i++) {
    if (ITEMS[i + OFFSET].url === url) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    if (MENU.detailsPage) {
      MENU.items[0].label = VIDEO_TO_START;
      MENU._drawRow(0);
    } else {
      MENU.items[index].label = INDICATOR_OFF + MENU.items[index].label.slice(3);
      MENU._drawRow(index);
    }
  }
  delete RUNNING[url];
});

function error(err) {
  if (MENU) {
    MENU.reset();
    MENU.close();
  }
  console.error(err.stack ? err.stack : err);
  try {
    process.kill();
  } catch(e) {
    process.exit(1);
  }
}

// serial(2) = [1, 2]  //  serial(5) = [1, 2, 3, 4, 5]
function serial(n) {
  return Array.apply(undefined, { length: n }).map(Function.call, function(i) {
    return i + 1;
  });
}

function killall(pid) {
  if (!pid) return;
  if (isWin32) {
    return exec('taskkill /pid ' + pid + ' /T /F');
  }
  exec('pgrep -P ' + pid, function(error, stdout, stderr) {
    if (stdout) {
      var pids = stdout.trim().split('\n');
      pids.forEach(function(pid) {
        if (pid) process.kill(pid, 'SIGKILL');
      });
    }
    process.kill(pid, 'SIGKILL');
  });
}

function cacheHash(items) {
  var text = items.map(function(item) {
    return item.url;
  }).join('\n');
  var shasum = require('crypto').createHash('sha1');
  shasum.update(text);
  return shasum.digest('hex');
}

// split('一a二b三c四五六七', 3) = ["一a", "二b", "三c", "四", "五", "六", "七"]
function split(str, len) {
  if (len < 1) len = 1;
  var chunks = [];
  while (str) {
    var s = '', c = 0;
    for (var i = 0; str[i] && i < len - c; i++) {
      if (/[^\u0000-\u00ff]/.test(str[i])) c++;
      if (i + 1 <= len - c) s += str[i];
    }
    chunks.push(s);
    str = str.slice(s.length);
  }
  return chunks;
}

function slice(str, len) {
  return str.slice(0, len - (str.match(/[^\u0000-\u00ff]/g) || '').length);
}

function pad(n) {
  return (n < 10 ? '0' : '') + n;
}

function makeMenu() {
  if (Object.prototype.toString.call(ITEMS) !== '[object Array]') return;
  if (ITEMS.length === 0) return;

  var selected = -1;
  if (MENU) {
    selected = MENU.selected;
    MENU.reset();
    MENU.close();
  }
  MENU = termMenu({ width: colMax, fg: OPTIONS.fg, bg: OPTIONS.bg });
  MENU.reset();
  MENU.write('');
  for (var i = 0; i < Math.min(rowMax, ITEMS.length); i++) {
    MENU.add(makeMenuItem(ITEMS, i + OFFSET));
  }
  if (selected > -1) MENU.selected = selected;
  MENU.on('select', function (label, index) {
    ytEvents.emit('start', index);
  });
  MENU.createStream().pipe(process.stdout);
}

function updateMenuItems() {
  for (var i = 0; i < Math.min(rowMax, ITEMS.length); i++) {
    MENU.items[i].label = makeMenuItem(ITEMS, i + OFFSET);
    MENU._drawRow(i);
  }
}

function makeMenuItem(items, index) {
  var item = items[index];
  var indLen = 1; // indicator length is 2 in `slice`, so distract 1
  var indicator = INDICATOR_OFF;
  if (RUNNING.hasOwnProperty(item.url)) indicator = INDICATOR_ON;
  var title = item.title;
  var duration = item.duration || '';
  if (duration && duration.length === 4) duration = '0' + duration;
  if (duration) {
    duration = '[' + duration + '] ';
  } else if (item.live) {
    duration = '[LIVE!] ';
  }
  var padding = Array(colMax).join(' ');
  var text = indicator + pad(index + 1) + '. ' + duration + title + padding;
  return slice(text, colMax + indLen);
}

function makeDetailsPage() {
  if (MENU) {
    selected = MENU.selected;
    MENU.reset();
    MENU.close();
  }
  var blankLines = rowMax;
  var ITEM = ITEMS[selected + OFFSET];
  MENU = termMenu({ width: colMax, fg: OPTIONS.fg, bg: OPTIONS.bg });
  MENU.detailsPage = true;
  MENU._selected = selected;
  MENU.reset();

  MENU.write('Title:\n');
  var title = split(ITEM.title, colMax - 2);
  title.forEach(function(line) {
    MENU.write(line + '\n');
  });
  MENU.write('\n');
  blankLines -= title.length + 2;

  var username = ITEM.username;
  if (ITEM.verified) username += ' (verified)'
  MENU.write('By: ' + username + '\n');
  MENU.write('\n');
  blankLines -= 2;

  MENU.write('Description:\n');
  var description = split(ITEM.description || '(none)', colMax - 2);
  description.forEach(function(line) {
    MENU.write(line + '\n');
  });
  MENU.write('\n');
  blankLines -= description.length + 2;

  var itemurl = split('URL: ' + ITEM.url, colMax - 2);
  itemurl.forEach(function(line) {
    MENU.write(line + '\n');
  });
  MENU.write('\n');
  blankLines -= itemurl.length + 1;

  if (RUNNING.hasOwnProperty(ITEM.url)) {
    MENU.add(VIDEO_TO_STOP);
  } else {
    MENU.add(VIDEO_TO_START);
  }
  MENU.add('Open this video in web browser');
  MENU.add('View the thumbnail of this video');
  MENU.write('\n');
  blankLines -= 4;

  blankLines -= 1;  // last line

  for (var i = 0; i < blankLines; i++) {
    MENU.write('\n');
  }

  var infobar = ITEM.time + ' - ' + (ITEM.views || 'no views');
  if (ITEM.live) infobar += ' (LIVE)';
  if (ITEM.duration) infobar += ' - ' + ITEM.duration;
  MENU.write(infobar + '\n');

  var url = ITEM.url, id = ITEM.id, thumburl = ITEM.thumbnails.maxresdefault;
  MENU.on('select', function (label, index) {
    if (index === 0) {
      var i = 0
      for (; i < ITEMS.length; i++) {
        if (ITEMS[i].url === url) {
          break;
        }
      }
      ytEvents.emit('start', i - OFFSET);
    } else if (index === 1) {
      open(url);
    } else if (index === 2) {
      MENU.items[2].label = 'Downloading thumbnail...';
      MENU._drawRow(2);
      var localfile = libdata.tempFile(id + '.jpg');
      var promise;
      if (fs.existsSync(localfile)) {
        promise = Q(localfile);
      } else {
        promise = download(thumburl, localfile);
      }
      promise.then(function(localfile) {
        open(localfile);
      }).finally(function() {
        MENU.items[2].label = 'View the thumbnail of this video';
        MENU._drawRow(2);
      });
    }
  });
  MENU.createStream().pipe(process.stdout);
}

process.stdin.on('data', function(buf) {
  if (!MENU) return;
  var codes = [].join.call(buf, '.');
  var selected;

  if (MENU.detailsPage) {
    // left / backspace / backspace (win) / escape
    if ([ '27.91.68', '127', '8', '27' ].indexOf(codes) > -1) {
      selected = MENU._selected;
      MENU.reset();
      MENU.close();
      makeMenu();
      if (selected > -1) MENU.selected = selected;
    } else if (codes === '27.91.54.126') {
      if (MENU._selected + OFFSET >= ITEMS.length - 1) return;
      selected = MENU.selected;
      MENU.selected = MENU._selected + 1;
      makeDetailsPage();
      MENU.selected = selected;
    } else if (codes === '27.91.53.126') {
      if (MENU._selected + OFFSET < 1) return;
      selected = MENU.selected;
      MENU.selected = MENU._selected - 1;
      makeDetailsPage();
      MENU.selected = selected;
    }
    return;
  }

  switch (codes) {
  case '9':                // tab
  case '32':               // space
  case '27.91.67':         // right
    selected = MENU.selected;
    makeDetailsPage();
    MENU._selected = selected;
    break;
  case '27.91.66':         // down
    if (MENU.selected === rowMax - 1) {
      if (ITEMS[rowMax + OFFSET]) {
        OFFSET++;
        updateMenuItems();
      }
      MENU.selected = rowMax - 2;
    }
    break;
  case '27.91.65':         // up
    if (MENU.selected === 0) {
      MENU.selected = 1;
      if (ITEMS[OFFSET - 1]) {
        OFFSET--;
        updateMenuItems();
      }
    }
    break;
  case '27.91.72':         // home
  case '27.91.49.126':     // home (win)
    OFFSET = 0;
    MENU.selected = 0;
    updateMenuItems();
    break;
  case '27.91.70':         // end
  case '27.91.52.126':     // end (win)
    OFFSET = ITEMS.length - rowMax;
    MENU.selected = rowMax - 1;
    updateMenuItems();
    break;
  case '27.91.54.126':     // pagedown
    OFFSET += rowMax;
    if (OFFSET + rowMax > ITEMS.length) {
      OFFSET = ITEMS.length - rowMax;
      MENU.selected = rowMax - 1;
    }
    updateMenuItems();
    break;
  case '27.91.53.126':     // pageup
    OFFSET -= rowMax;
    if (OFFSET < 0) {
      OFFSET = 0;
      MENU.selected = 0;
    }
    updateMenuItems();
    break;
  }
});

function download(url, to) {
  var deferred = Q.defer();
  var req = https.get(url, function(res) {
    res.pipe(fs.createWriteStream(to));
    res.on('end', function() {
      deferred.resolve(to);
    });
  });
  req.on('error', function (err) {
    deferred.reject(err);
  });
  req.end();
  return deferred.promise;
}
