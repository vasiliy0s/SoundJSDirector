'use strict';

// TODO: add easings to all of current methods.

SoundJSDirectorGroupProto.play = function playGroup (options) {
  // TODO: Pass group options to every sounds considering every group of sound.

  options = SoundJSDirector.extend({}, options, this.options);

  if (!options.collapsed) {
    this._playFreeSounds(options);
  }
  
  else {
    this._playCollapsed(options);
  }
  
  return this;

};

SoundJSDirectorGroupProto._playFreeSounds = function (options) {
  // TODO: pass arguments multiplied with all instance groups.
  SoundJSDirector.each(this._wait, function (sound) {
    sound.play(options);
  });
  return this;
};

SoundJSDirectorGroupProto._playCollapsed = function (options) {
  // TODO: pass arguments multiplied with all instance groups.
  var sound = SoundJSDirector.randomItem(this._wait);
  if (sound) {
    sound.play(options);
  }
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

