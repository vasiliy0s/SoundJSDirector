'use strict';

// TODO: new SoundJSDirector.Group() - constructor of sound groups.
// TODO: new SoundJSDirector.Sound() - contructor-wrapper for soun instances with depended by group settings methods.
// TODO: new SoundJSDirector.Manager() - manager with scoped registered groups, sounds and package applyers.
// TODO: events in group like single sound.
// TODO: SoundJSDirector.setGroups() - register groups of sounds.
// TODO: SoundJSDirector.setSounds() - register sounds (with initialization or loading).
// TODO: Group.play(options) - play all sounds in group.
// TODO: Group.stop(options) - -/-.
// TODO: Group.pause() - -/-.
// TODO: Group.setVolume() - -/-.
// TODO: Group.getVolume() - -/-, etc.
// TODO: autoinclude to PreloadJS as plugin if it possible.

var SoundJS = createjs.SoundJS = createjs.SoundJS || {};

function SoundJSDirector (/* config */) {
  // TODO: initalize with @config.
}

SoundJS.Director = SoundJSDirector;

createjs.SoundJSDirector = SoundJSDirector;

var DirectorProto = SoundJSDirector.prototype = new createjs.EventDispatcher();

DirectorProto._sendEvent = function (type) {
  var event = new createjs.Event(type);
  this.dispatchEvent(event);
};
