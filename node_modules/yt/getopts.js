var $0   = require('path').basename(process.argv[1]);
var args = process.argv.slice(2);

var opts = {
  p: 10,
  f: '360p',
  bg: 'blue',
  fg: 'white'
};
var keys = Object.keys(opts);

for (var i = args.length - 1; i > -1; i--) {
  if (!args[i]) continue;
  switch (args[i]) {
  case '-h':
    var l = console.log;
    l('Usage: ' + $0 + ' [OPTION]');
    l();
    l('  -h           show this content and exit');
    l('  -v           print version number and exit');
    l('  -p <pages>   get number of pages of videos, default is 10');
    l('  -f <format>  use this video format, default is 360p');
    l('  -bg <color>  set background color, default is blue');
    l('  -fg <color>  set foreground color, default is white');
    l();
    l('  format: 240p, 360p, 480p, 720p, 1080p');
    l('  color: black, red, green, yellow, blue, magenta, cyan, white, 0-255');
    process.exit(0);
  case '-v':
    console.log(require('./package.json').version);
    process.exit(0);
  default:
    var isarg = false;
    for (var j = 0; j < keys.length; j++) {
      if (args[i - 1] === '-' + keys[j]) {
        opts[keys[j]] = sanitize(args[i]);
        args.splice(i - 1, 2);
        isarg = true;
        break;
      } else if (args[i] === '-' + keys[j]) {
        if (isStr(opts[keys[j]])) {
          error('empty value for option "' + args[i] + '"');
        }
      }
    }
    if (isarg) continue;
    error('unknown option "' + args[i] + '"');
  }
}

module.exports = opts;

function error(e) {
  console.error(e);
  process.exit(1);
}

function isStr(what) {
  return typeof what === 'string';
}

function sanitize(what) {
  if (/^[0-9]+$/.test(what)) return +what;
  return what;
}
