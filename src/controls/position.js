'use strict';

// Set @value position for every sound in group.
SoundJSDirectorGroup.prototype.setPosition = function setGroupPosition (value) {
  this.eachPlayingSound(function (sound) {
    sound.setPosition(value);
  });
  return this;
};

// Shortlink.
SoundJSDirectorGroup.prototype.seek = SoundJSDirectorGroup.prototype.setPosition;
