'use strict';

// TODO: add easings to all of current methods.

SoundJSDirectorGroupProto.play = function playGroup (options) {
  // TODO: Pass group options to every sounds considering every group of sound.

  var _options = SoundJSDirector.extend({}, options, this.options);

  if (!_options.collapsed) {
    this.eachSound(function (sound) {
      // TODO: pass arguments multiplied with all instance groups.
      // TODO: check sound.playState.
      sound.play(_options);
    }, this);
  }
  
  else {
    var sound, 
        played = false,
        PLAY_SUCCEEDED = createjs.Sound.PLAY_SUCCEEDED,
        sounds = this.sounds,
        stop = sounds.length * 2;
    do {
      sound = SoundJSDirector.randomItem(this.sounds);
      if (sound && PLAY_SUCCEEDED !== sound.playState) {
        sound.play(_options);
        played = true;
      }
    } while (stop-- && !played);
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

