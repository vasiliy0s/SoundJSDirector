'use strict';

// TODO: SoundJSDirector.setGroups() - register groups of sounds.
// TODO: SoundJSDirector.setSounds() - register sounds (with initialization or loading).
// TODO: Group.play(options) - play all sounds in group.
// TODO: Group.stop(options) - -/-.
// TODO: Group.pause() - -/-.
// TODO: Group.setVolume() - -/-.
// TODO: Group.getVolume() - -/-, etc.
// TODO: autoinclude to PreloadJS as plugin if it possible.
// TODO: provide sounds events in group like 'playing', 'played', 'loaded', other...

function SoundJSDirector (/* config */) {
  // TODO: initalize with @config.
}

createjs.SoundJSDirector = SoundJSDirector;

var DirectorProto = SoundJSDirector.prototype = new createjs.EventDispatcher();

DirectorProto._sendEvent = function (type) {
  var event = new createjs.Event(type);
  this.dispatchEvent(event);
};
