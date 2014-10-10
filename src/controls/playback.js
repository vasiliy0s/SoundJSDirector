'use strict';

// TODO: add easings to all of current methods.

// TODO: Pass group options to every sounds considering every group of sound.

// Play instances (free/all/one by id/src) with @options.
// Usages:
// .play() - play all free sounds with group options.
// .play(id) - play only one instance (if exists) from group by id or src with group options.
// .play(id, options) - play only one instance (if exists) from group by id or src with custom @options extended by group options.
// .play(options, true) - play all (of group) sounds with @options extened by gropu options; @options can contain .id or .src for play only defined sound.
// .play(options) - play all free sounds with @options extended by group options; @options can contain .id or .src for play only defined sound; @options can contain .all property for select playing sounds from all group sounds (not only free sounds).
SoundJSDirectorGroupProto.play = function playGroup () {

  var arg0 = arguments[0], id, options, all = false;

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
      else {
        options = arg0;
        all = arg1;
      }
    } break;
    
    case 1: {
      switch (typeof arg0) {
        case 'string': id = arg0; break;
        case 'object': options = arg0; id = options.id || options.src; break;
        case 'boolean': all = arg0; break;
        default: throw 'SoundJSDirector.Group.play() given bad arguments';
      }
    } break;
    
    case 0: break;
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
    this._playSoundWithOptions(sound, options);
  }

  return this;
};

// Play @sound instance with @options.
SoundJSDirectorGroupProto._playSoundWithOptions = 
function playSoundWithOptions (sound, options) {
  var _options = {};
  SoundJSDirector.each(options, function (value, name) {
    switch (name) {
      default: _options[name] = value; break;
      case 'pan': _options[name] = this.getSoundPan(sound, value); break;
      case 'volume': _options[name] = this.getSoundVolume(sound, value); break;
    }
  }, this);
  sound.play(_options);
  return this;
};

// Play free/all sounds in group.
SoundJSDirectorGroupProto._playSounds = function playSounds (options, all) {
  SoundJSDirector.each(
    all ? this.sounds : this._wait, 
    function (sound) {
      this._playSoundWithOptions(sound, options);
    },
    this
  );
  return this;
};

// Play first of free/all sounds.
SoundJSDirectorGroupProto._playCollapsed = function playCollapsed (options, all) {
  var sound = SoundJSDirector.randomItem(all ? this.sounds : this._wait);
  if (sound) {
    this._playSoundWithOptions(sound, options);
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

