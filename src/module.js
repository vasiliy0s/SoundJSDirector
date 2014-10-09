'use strict';

// TODO: SoundJSDirector.setGroups() - register groups of sounds.
// TODO: SoundJSDirector.setSounds() - register sounds (with initialization or loading).
// TODO: Process priorities of every sound with group.
// TODO: Group.setVolume() - -/-.
// TODO: Group.getVolume() - -/-, etc.
// TODO: provide sounds events in group like 'playing', 'played', 'loaded', other...

function SoundJSDirector () {
  throw 'SoundJSDirector cannot be initialized. Use \'new SoundJSDirector.Group\' for manage sounds';
}

createjs.SoundJSDirector = SoundJSDirector;

var DirectorProto = SoundJSDirector.prototype = new createjs.EventDispatcher();

DirectorProto._sendEvent = function (type) {
  var event = new createjs.Event(type);
  this.dispatchEvent(event);
};
