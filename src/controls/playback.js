'use strict';

// TODO: add easings to all of current methods.

SoundJSDirectorGroupProto.play = function playGroup (options, all) {
  // TODO: Pass group options to every sounds considering every group of sound.

  options = SoundJSDirector.extend(
    SoundJSDirector.parseOptions(options),
    this.options
  );

  if (!options.collapsed) {
    this._playSounds(options, all);
  }
  
  else {
    this._playCollapsed(options, all);
  }
  
  return this;

};

// Play sound by @id (id/src of sound instance) with @options.
SoundJSDirectorGroupProto.playSound = function playGroupSound (id, options) {

  var sounds = this.sounds,
      sound = sounds[id];

  if (!sound && isNaN(parseInt(id))) {
    this.eachSound(function (_sound) {
      if (id === _sound.id || id === _sound.src) {
        sound = _sound;
        return SoundJSDirector.OUT_EACH;
      }
    });
  }

  if (sound) {
    sound.play(options);
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
  this.eachPlayingSound(function (sound) {
    sound.pause();
  });
  return this;
};

// Resume all paused group sounds.
SoundJSDirectorGroupProto.resume = function resumeGroup () {
  this.eachPlayingSound(function (sound) {
    sound.resume();
  });
  return this;
};

// Stop all playing group sounds.
SoundJSDirectorGroupProto.stop = function stopGroup () {
  this.eachPlayingSound(function (sound) {
    sound.stop();
  });
  return this;
};

