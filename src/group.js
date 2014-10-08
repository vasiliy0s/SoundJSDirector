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

SoundJSDirectorGroupProto.play = function playGroup () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.pause = function pauseGroup () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.resume = function resumeGroup () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.stop = function stopGroup () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.setVolume = function setGroupVolume (volume) {
  // TODO
  
  var options = options;

  volume = parseFloat(volume);
  
  if (volume === options.volume) {
    return this;
  }
  
  var sounds = this.sounds, 
      len = sounds.length;

  if (!len) {
    return this;
  }
  
  for (var i = len, sound; i--; ) {
    sound = sounds[i];
    sound.setVolume(this.getSoundVolume(sound));
  }
  
  return this;

};

SoundJSDirectorGroupProto.getSoundVolume = function (sound) {
  // 
};

SoundJSDirectorGroupProto.setLoop = function setGroupLoop () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.setPan = function setGroupPan () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.setMute = function setGroupMute () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.setUnmute = function setGroupUnumte () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.switchMute = function switchGroupMute () {
  // TODO
  return this;
};
