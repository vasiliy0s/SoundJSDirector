'use strict';

// Set @value state of sound muting.
SoundJSDirectorGroupProto.setMute = function setGroupMute (value) {
  this.eachSound(function (sound) {
    sound.setMute(value);
  });
  return this;
};

// Switch current sound mute state.
SoundJSDirectorGroupProto.switchMute = function switchGroupMute () {
  this.eachSound(function (sound) {
    sound.setMute(!sound.getMute());
  });
  return this;
};
