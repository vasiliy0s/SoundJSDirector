'use strict';

// TODO: add easings to all of current methods.

SoundJSDirectorGroupProto.play = function playGroup (options, all) {
  // TODO: Pass group options to every sounds considering every group of sound.

  options = SoundJSDirector.extend({}, options, this.options);

  if (!options.collapsed) {
    this._playSounds(options, all);
  }
  
  else {
    this._playCollapsed(options, all);
  }
  
  return this;

};

// Play free/all sounds in group.
SoundJSDirectorGroupProto._playSounds = function (options, all) {
  // TODO: pass arguments multiplied with all instance groups.
  SoundJSDirector.each(
    all ? this.sounds : this._wait, 
    function (sound) {
      sound.play(options);
    }
  );
  return this;
};

// Play first of free/all sounds.
SoundJSDirectorGroupProto._playCollapsed = function (options, all) {
  // TODO: pass arguments multiplied with all instance groups.
  var sound = SoundJSDirector.randomItem(all ? this.sounds : this._wait);
  if (sound) {
    sound.play(options);
  }
  return this;
};

// Pause all playing sounds.
SoundJSDirectorGroupProto.pause = function pauseGroup () {
  SoundJSDirector.each(this._playing, function (sound) {
    sound.pause();
  });
  return this;
};

// Resume all paused group sounds.
SoundJSDirectorGroupProto.resume = function resumeGroup () {
  SoundJSDirector.each(this._playing, function (sound) {
    sound.resume();
  });
  return this;
};

// Stop all playing group sounds.
SoundJSDirectorGroupProto.stop = function stopGroup () {
  SoundJSDirector.each(this._playing, function (sound) {
    sound.stop();
  });
  return this;
};

