'use strict';

// TODO: add easings to all of current methods.
// TODO: add README.md with basic functionality.
// TODO: extend README.md to full documentation.
// TODO: Process priorities of every sound in group for collapsed groups playing.
// TODO: provide sounds events in group like 'playing', 'played', 'loaded', other...
// TODO: pass Sound.INTERRUPT's to play() method.

function SoundJSDirector () {
  throw 'SoundJSDirector cannot be initialized. Use \'new SoundJSDirector.Group\' for manage sounds';
}

createjs.SoundJSDirector = SoundJSDirector;

var DirectorProto = SoundJSDirector.prototype = new createjs.EventDispatcher();

DirectorProto._sendEvent = function (type) {
  var event = new createjs.Event(type);
  this.dispatchEvent(event);
};

DirectorProto.toString = function () {
  return '[SoundJSDirector]';
};
