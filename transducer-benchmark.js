const t = require("transducers-js");
const trj = require("transducers.js");
const tr = require("transduce");
const _r = require("underarm");
const _ = require("lodash");
const f = require("fkit");

const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();

const numbers = [0, 1, 2, 3, 4];
const increment = n => n + 1;
const isEven = n => n % 2 === 0;

suite
  .add("transducers-js", () => {
    t.into([], t.comp(t.map(increment), t.filter(isEven)), numbers);
  })
  .add("transducers.js", () => {
    trj.into([], trj.compose(trj.map(increment), trj.filter(isEven)), numbers);
  })
  .add("transduce", () => {
    tr.into([], tr.compose(tr.map(increment), tr.filter(isEven)), numbers);
  })
  .add("underarm", () => {
    _r.into([], _r.compose(_r.filter(isEven), _r.map(increment)), numbers);
  })
  .add("fkit", () => {
    f.compose(f.filter(isEven), f.map(increment))(numbers);
  })
  .add("lodash", () => {
    _.chain(numbers).filter(isEven).map(increment).value();
  })
  .on("cycle", event => {
    console.log(String(event.target));
  })
  .on("complete", () => {
    console.log("Fastest is " + suite.filter("fastest").map("name"));
  })
  .run({ async: true });
