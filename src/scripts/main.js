// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke'),
  voltaire = require('bespoke-theme-voltaire'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  scale = require('bespoke-scale'),
  hash = require('bespoke-hash'),
  progress = require('bespoke-progress');

// Bespoke.js
bespoke.from('article', [
  voltaire(),
  keys(),
  touch(),
  bullets('li, .bullet'),
  scale(),
  hash(),
  progress()
]);

// Prism syntax highlighting
// This is actually loaded from "bower_components" thanks to
// debowerify: https://github.com/eugeneware/debowerify
require('prism');
require('zepto');
require('underscore-transducer');

var $demo = $('#demo3'),
    clickCount = 0,
    coords = _r().where({type:'mousemove'})
                 .map(function(e){return {x: e.clientX, y: e.clientY}})
                 .map(function(p){return '('+p.x+', '+p.y+')'})
                 .each(updateText)
                 .asCallback(),

click = _r().where({type:'click'})
            .each(updateCount)
            .asCallback(),

events = _r().each(coords)
             .each(click)
             .asCallback();

$demo.on('mousemove click', events);

function updateText(p){
  $demo.html(p);
}

function updateCount(){
  $demo.html('Click '+(clickCount++));
}
