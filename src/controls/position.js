'use strict';

// Set @value position for every sound in group.
SoundJSDirectorGroupProto.setPosition = function setGroupPosition (value) {
  this.eachPlayingSound(function (sound) {
    sound.setPosition(value);
  });
  return this;
};
