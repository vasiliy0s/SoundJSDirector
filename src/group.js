'use strict';

// TODO: add events for methods.

function SoundJSDirectorGroup (name, options) {
  var argsLen = arguments.length;
  if (1 === argsLen) {
    name = options.name;
  }
  else if (0 === argsLen) {
    throw 'SoundJSDirector.Group there is no passed arguments';
  }
  this.name = name;
  options = this.options = SoundJSDirector.extend({}, options, DEFAULT_OPTIONS);
  this.sounds = [];
  var addingSounds = options.sounds;
  if (addingSounds instanceof Array) {
    for (var i = addingSounds.length; i--; ) {
      this.addSound(addingSounds[i]);
    }
  }
}

SoundJSDirector.Group = SoundJSDirector.prototype.Group = SoundJSDirectorGroup;

var SoundJSDirectorGroupProto = SoundJSDirectorGroup.prototype = new createjs.EventDispatcher();

SoundJSDirectorGroupProto.join = function joinGroup (sound) {
  if (sound instanceof Array) {
    for (var i = sound.length; i--; ) {
      this.join(sound[i]);
    }
    return this;
  }
  SoundJSDirector.setSoundGroup(sound, this);
  this.sounds.push(sound);
  return this;
};

SoundJSDirectorGroupProto.leave = function leaveGroup (/*sound*/) {
  // body...
  return this;
};
