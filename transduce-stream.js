const fs = require('fs');
const _r = require('underarm');
const stream = require('transduce-stream');

const argv = require('optimist')
    .usage('Usage: $0 --length [num] --limit [num] --method [file|stdin]')
    .demand(['length', 'limit'])
    .argv;

const transducer = _r().words()
                   .filter(word => word.length === argv.length)
                   .unique()
                   .take(argv.limit)
                   .map(word => word + "\n")
                   .compose();

if (argv.method === 'stdin') {
  process.stdin.pipe(stream(transducer)).pipe(process.stdout);
} else {
  const readStream = fs.createReadStream('/usr/share/dict/words');
  readStream.pipe(stream(transducer)).pipe(process.stdout);
}
