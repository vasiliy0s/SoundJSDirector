'use strict';

// TODO: add README.md with basic functionality.
// TODO: extend README.md to full documentation.
// TODO: SoundJSDirector.setGroups() - register groups of sounds.
// TODO: SoundJSDirector.setSounds() - register sounds (with initialization or loading).
// TODO: Process priorities of every sound with group.
// TODO: provide sounds events in group like 'playing', 'played', 'loaded', other...
// TODO: process INTERRUPTs on play.

function SoundJSDirector () {
  throw 'SoundJSDirector cannot be initialized. Use \'new SoundJSDirector.Group\' for manage sounds';
}

createjs.SoundJSDirector = SoundJSDirector;

var DirectorProto = SoundJSDirector.prototype = new createjs.EventDispatcher();

DirectorProto._sendEvent = function (type) {
  var event = new createjs.Event(type);
  this.dispatchEvent(event);
};
