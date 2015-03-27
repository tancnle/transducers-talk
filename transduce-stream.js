var fs = require('fs');
var _r = require('underarm');
var stream = require('transduce-stream');

var argv = require('optimist')
    .usage('Usage: $0 -length [num] -sub [string] -method [file|stdin]')
    .demand(['length', 'sub', 'method'])
    .argv;

var containString = function(regex) {
  return function(str) {
    var re = new RegExp(regex);
    return re.test(str);
  };
};

var transducer = _r().lines()
                     .filter(function(x) { return x.length === argv.length; })
                     .filter(containString(argv.sub))
                     .map(function(x) { return x + ' '; })
                     .take(10)
                     .push('\n')
                     .compose();

if (argv.method === 'file') {
  var readStream = fs.createReadStream('/usr/share/dict/words');
  readStream.pipe(stream(transducer)).pipe(process.stdout);
} else {
  process.stdin.resume();
  process.stdin.pipe(stream(transducer)).pipe(process.stdout);
}
