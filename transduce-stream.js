const fs = require('fs');
const _r = require('underarm');
const stream = require('transduce-stream');

const argv = require('optimist')
    .usage('Usage: $0 -length [num] -sub [string] -limit [num] -method [file|stdin]')
    .default({limit: 10, method: 'file'})
    .demand(['length', 'sub'])
    .argv;

const withLengthOf = (length) => {
  return (str) => (str.length === length);
};

const containString = (regex) => {
  return (str) => {
    const re = new RegExp(regex);
    return re.test(str);
  };
};

const withNewLine = (str) => {
  return str + "\n";
};

const transducer = _r().words()
                       .filter(withLengthOf(argv.length))
                       .filter(containString(argv.sub))
                       .take(argv.limit)
                       .map(withNewLine)
                       .compose();

if (argv.method === 'file') {
  const readStream = fs.createReadStream('/usr/share/dict/words');
  readStream.pipe(stream(transducer)).pipe(process.stdout);
} else {
  process.stdin.pipe(stream(transducer)).pipe(process.stdout);
}
