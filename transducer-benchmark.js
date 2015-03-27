var t = require('transducers-js');
var trj = require('transducers.js');
var tr = require('transduce');
var _r = require('underarm');
var f = require('fkit');

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

var increment = function(n) { return n + 1; };
var isEven = function(n) { return n % 2 === 0; };

suite.add('transducers-js', function() {
  t.into([], t.comp(t.map(increment), t.filter(isEven)), [0,1,2,3,4]);
})
.add('transducers.js', function() {
  trj.into([], trj.compose(trj.map(increment), trj.filter(isEven)), [0,1,2,3,4]);
})
.add('transduce', function() {
  tr.into([], tr.compose(tr.map(increment), tr.filter(isEven)), [0,1,2,3,4]);
})
.add('underarm', function() {
  _r.into([], _r.compose(_r.filter(isEven), _r.map(increment)), [0,1,2,3,4]);
})
.add('fkit', function() {
  f.compose(f.filter(isEven), f.map(increment))([0,1,2,3,4]);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ 'async': true });
