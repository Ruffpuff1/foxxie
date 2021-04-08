var Q          = require('q');
var fs         = require('fs');
var path       = require('path');
var spawn      = require('child_process').spawn;

var YTDir      = path.join(getUserHome(), '.config', 'yt');
var CookieFile = path.join(YTDir, 'cookie.json');
var CacheFile  = path.join(YTDir, 'cache.json');
var WinTmpDir  = path.join(getUserHome(), 'AppData', 'Local', 'Temp');

var INSTRUCTIONS = 'No cookie found! Please follow these steps:\n' +
'1. Open Google Chrome and right click the page and select Inspect Element.\n' +
'2. Go to https://www.youtube.com/, log in if you don\'t have.\n' +
'3. In Networks tab, click Documents and right click the first item in the \n' +
'   list and click Copy as cURL.\n' +
'4. Re-run this command and it will read the contents of your clipboard.';

module.exports = {
  checkCookie: checkCookie,
  readCache: readCache,
  saveCache: saveCache,
  tempFile: tempFile
};

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function tempFile(filename) {
  if (process.platform === 'win32') {
    mkdirp(WinTmpDir);
    return path.join(WinTmpDir, filename);
  }
  return '/tmp/' + filename;
}

function mkdirp(dirpath) {
  dirpath.split(/[\/\\]/g).reduce(function(parts, part) {
    parts += part + '/';
    try {
      fs.mkdirSync(path.resolve(parts));
    } catch(e) {}
    return parts;
  }, '');
}

function isStr(what) {
  return what && (typeof what === 'string');
}
function isObj(what) {
  return Object.prototype.toString.call(what) === '[object Object]';
}

function readCookie() {
  try {
    var cookie = JSON.parse(fs.readFileSync(CookieFile).toString());
    var sid = cookie.SID;
    var hsid = cookie.HSID;
    var ssid = cookie.SSID;
    var login_info = cookie.LOGIN_INFO;
    if (!isStr(sid) || !isStr(hsid) || !isStr(ssid) || !isStr(login_info)) {
      throw undefined;
    }
    return {
      SID: sid,
      HSID: hsid,
      SSID: ssid,
      LOGIN_INFO: login_info
    };
  } catch(e) {
    return {};
  }
}

function readCache(key) {
  try {
    var cache = JSON.parse(fs.readFileSync(CacheFile).toString());
    if (!isObj(cache)) throw undefined;
    if (key) return cache[key];
    return cache;
  } catch(e) {
    return undefined;
  }
}

function saveFile(filepath, _data, key) {
  if (!fs.existsSync(YTDir)) {
    mkdirp(YTDir);
  } else if (!fs.statSync(YTDir).isDirectory()) {
    fs.unlinkSync(YTDir);
    mkdirp(YTDir);
  }
  var data;
  if (key) {
    data = {};
    try {
      var d = JSON.parse(fs.readFileSync(filepath).toString());
      if (!isObj(d)) throw undefined;
      data = d;
    } catch(e) {}
    data[key] = _data;
  } else {
    data = _data;
  }
  fs.writeFileSync(
    filepath,
    JSON.stringify(data, undefined, 2),
    { mode: 0600 }
  );
}

function saveCookie(data) {
  saveFile(CookieFile, data);
}

function saveCache(data, key) {
  saveFile(CacheFile, data, key);
}

function checkCookie() {
  var cookie = readCookie();
  if (typeof cookie === 'object' && Object.keys(cookie).length > 0) {
    return Q(cookie);
  } else {
    return getClipboard().then(function(content) {
      var data = content.match(/\b(SID|HSID|SSID|LOGIN_INFO)=([a-zA-Z0-9_\-]{1,})/g);
      if (!data || data.length !== 4) throw INSTRUCTIONS;
      var cookie = {};
      for (var i = 0; i < data.length; i++) {
        var d = data[i].split('=', 2);
        cookie[d[0]] = d[1];
      }
      saveCookie(cookie);
      return checkCookie();
    });
  }
}

function getClipboard() {
  var cb = {
    darwin: [ 'pbpaste' ],
    linux: [ 'xclip', [ '-selection', 'clipboard', '-out' ] ],
    win32: [ 'cscript', [ '/Nologo', path.join(__dirname, 'paste.vbs') ] ]
  }[ process.platform ];
  if (!cb) return Q.reject('No clipboard command for your OS!');
  var deferred = Q.defer();
  var clipboard = spawn.apply(undefined, cb);
  var data = '';
  clipboard.stdout.on('data', function(chunk) {
    data += chunk;
  });
  clipboard.stdout.on('end', function() {
    deferred.resolve(data);
  });
  clipboard.on('exit', function(code) {
    if (code) deferred.reject('Exit with code: '+ code);
  });
  clipboard.on('error', function(e) {
    deferred.reject('Failed to read clipboard. Make sure you have access to ' +
      'command `' + cb[0] + '`.');
  });
  return deferred.promise;
}
