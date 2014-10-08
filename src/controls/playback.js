'use strict';

// TODO: add easings to all of current methods.

SoundJSDirectorGroupProto.play = function playGroup (options) {
  // TODO: Pass group options to every sounds considering every group of sound.
  this.eachSound(function (sound) {
    // TODO: pass arguments multiplied with all instance groups.
    sound.play(options);
  }, this);
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

