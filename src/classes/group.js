'use strict';

function SoundJSDirectorGroup (name, options) {
  var argsLen = arguments.length;
  if (1 === argsLen) {
    name = options.name;
  }
  else if (0 === argsLen) {
    throw 'SoundJSDirector.Group there is no passed arguments';
  }
  this.name = name;
  this.options = SoundJSDirector.extend({}, options, DEFAULT_OPTIONS);
  this.sounds = [];
}

SoundJSDirector.Group = SoundJSDirector.prototype.Group = SoundJSDirectorGroup;

var SoundJSDirectorGroupProto = SoundJSDirectorGroup.prototype = new createjs.EventDispatcher();

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
    sound.setVolume(sound.getGroupVolume());
  }
  
  return this;

};

SoundJSDirectorGroupProto.setLoop = function setGroupLoop () {
  // TODO
};

SoundJSDirectorGroupProto.setPan = function setGroupPan () {
  // TODO
};

SoundJSDirectorGroupProto.setMute = function setGroupMute () {
  // TODO
};

SoundJSDirectorGroupProto.setUnmute = function setGroupUnumte () {
  // TODO
};

SoundJSDirectorGroupProto.switchMute = function switchGroupMute () {
  // TODO
};
