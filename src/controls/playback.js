'use strict';

// TODO: add easings to all of current methods.

// TODO: Pass group options to every sounds considering every group of sound.
  
SoundJSDirectorGroupProto.play = function playGroup (options, all) {

  var arg0 = arguments[0], id;

  switch (arguments.length) {

    default:
    case 2: {
      var arg1 = arguments[1];
      if ('object' === typeof arg1) {
        id = arg0;
        options = arg1;
        all = false;
      }
      else if ('object' !== typeof arg0) {
        throw 'SoundJSDirector.Group.play() given bad arguments';
      }
    } break;
    
    case 1: {
      switch (typeof arg0) {
        case 'string': id = arg0; options = all = false; break;
        case 'object': id = arg0.id || arg0.src; all = false; break;
        case 'boolean': all = arg0; options = id = false; break;
        default: throw 'SoundJSDirector.Group.play() given bad arguments';
      }
    } break;
    
    case 0: all = options = id = false; break;
  }

  var _options = SoundJSDirector.extend(
    SoundJSDirector.parseOptions(options),
    this.options
  );

  if (id) {
    this.playSound(id, _options);
  }

  else if (!_options.collapsed) {
    this._playSounds(_options, all);
  }
  
  else {
    this._playCollapsed(_options, all);
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

// Play @sound instance with @options.
SoundJSDirectorGroupProto._playSoundWithOptions = function playSoundWithOptions (/*sound, options*/) {
  // TODO: process options of every sound.
};

// Play free/all sounds in group.
SoundJSDirectorGroupProto._playSounds = function playSounds (options, all) {
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
SoundJSDirectorGroupProto._playCollapsed = function playCollapsed (options, all) {
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

