var fs = require('fs');
var _r = require('underarm');
var stream = require('transduce-stream');

var argv = require('optimist')
    .usage('Usage: $0 -length [num] -sub [string] -method [file|stdin]')
    // .demand(['length', 'sub', 'method'])
    .argv;

var transducer = _r().lines()
                     .take(10)
                     .compose();

if (argv.method === 'file') {
  var readStream = fs.createReadStream('/usr/share/dict/words');
  readStream.pipe(stream(transducer)).pipe(process.stdout);
} else {
  process.stdin.resume();
  process.stdin.pipe(stream(transducer)).pipe(process.stdout);
}
