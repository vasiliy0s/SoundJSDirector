/**
 * SoundJS Director v0.3.1
 * Manager for groupped and alone sounds in CreateJS/SoundJS with SoundJSDirector
 * by Vasiliy Os <talk@vasiliy0s.com>
 */

;(function (createjs) {

'use strict';

function SoundJSDirector () {
  throw 'SoundJSDirector cannot be initialized. Use \'new SoundJSDirector.Group\' for manage sounds';
}

createjs.SoundJSDirector = SoundJSDirector;

SoundJSDirector.prototype = new createjs.EventDispatcher();

SoundJSDirector.prototype._sendEvent = function (type) {
  var event = new createjs.Event(type);
  this.dispatchEvent(event);
};

SoundJSDirector.prototype.toString = function () {
  return '[SoundJSDirector]';
};


function SoundJSDirectorGroup (name, options) {

  if (!(this instanceof SoundJSDirectorGroup)) {
    return new SoundJSDirectorGroup(name, options);
  }
  
  var argsLen = arguments.length;
  
  if (1 === argsLen) {
    switch (typeof name) {
      case 'string': {
        options = SoundJSDirector.extend(SoundJSDirector._defaults);
        options.name = name;
      } break;
      case 'object': {
        options = name;
        name = options.name;
      } break;
    }
  }
  
  else if (0 === argsLen) {
    throw 'SoundJSDirector.Group there is no passed arguments';
  }
  
  if (!(name && 'string' === typeof name)) {
    throw 'SoundJSDirector.Group cannot initialize new sounds group without name';
  }

  this.name = name;

  // Parse options.
  this.options = SoundJSDirector.extend(
    SoundJSDirector.parseOptions(options),
    SoundJSDirector._defaults, 
    true
  );

  // Sound collections.
  this.sounds = [];
  this._playing = [];
  this._wait = [];
  
  // Add sounds from config.
  var addingSounds = SoundJSDirector.toArray(options.sounds);
  if (options.sound) {
    addingSounds.push(options.sound);
  }
  this.add(addingSounds);

  // Register group for access by name.
  SoundJSDirector.group(this);

}

// Gropp link.
SoundJSDirector.Group = SoundJSDirector.prototype.Group = SoundJSDirectorGroup;

// Prototype.
SoundJSDirectorGroup.prototype = new createjs.EventDispatcher();

// Add sounds with instances creation from SoundJS @manifest.
SoundJSDirectorGroup.prototype.add = function addSounds (manifests) {
  var Sound = createjs.Sound,
      group = this,
      instance;
  if (!(manifests instanceof Array)) {
    manifests = [manifests];
  }
  SoundJSDirector.each(
    SoundJSDirector.toArray(manifests),
    function (manifest) {
      manifest = ('object' === typeof manifest ? manifest : {'src': manifest});
      var res = Sound.registerSound(manifest, manifest.basePath || group.get('basePath'));
      if (!res) {
        throw 'SoundJSDirector.Group ' + this.name + ' cannot register sound ' + (manifest.id || manifest.src);
      }
      instance = Sound.createInstance(manifest.id || manifest.src);
      if (instance) {
        this.join(instance);
      }
    },
    this
  );
  return this;
};

// Join @sounds (sound instance or array of sound instances) to current group.
SoundJSDirectorGroup.prototype.join = function joinGroup (sounds) {
  if (sounds && 'object' === typeof sounds) {
    if (!(sounds instanceof Array)) {
      SoundJSDirector.setSoundGroup(sounds, this);
    }
    else {
      SoundJSDirector.each(sounds, this.join, this);
    }
  }
  return this;
};

// Leave @sound (instance or array of instances) from current group.
SoundJSDirectorGroup.prototype.leave = function leaveGroup (sounds) {
  if (sounds instanceof Array) {
    SoundJSDirector.each(sounds, this.leave, this);
  }
  else if ('object' === typeof sounds) {
    SoundJSDirector.unsetSoundGroup(sounds, this);
  }
  return this;
};

SoundJSDirectorGroup.prototype.flush = function flushGroup () {
  this.leave(this.sounds);
  this.sounds.length = 0;
  this._playing.length = 0;
  this._wait.length = 0;
  return this;
};

// Call @callback (with @ctx) with every sound of group.
SoundJSDirectorGroup.prototype.eachSound = function eachSound (callback, ctx) {
  SoundJSDirector.each(this.sounds, callback, ctx || null);
};

// Call @callback (with @ctx) with every currently playing sound.
SoundJSDirectorGroup.prototype.eachPlayingSound = function eachPlayingSound (callback, ctx) {
  SoundJSDirector.each(this._playing, callback, ctx || null);
};

// Call @callback (with @ctx) with every currently not playing sound.
SoundJSDirectorGroup.prototype.eachWaitSound = function eachWaitSound (callback, ctx) {
  SoundJSDirector.each(this._wait, callback, ctx || null);
};

// Returns sound instance by id or src (as is setted in .add() method).
SoundJSDirectorGroup.prototype.sound = function getSound (sound) {
  return this.sounds[sound] || null;
};

// Check for sound instance exists in group;
SoundJSDirectorGroup.prototype.exists = function soundExists (sound) {
  switch (typeof sound) {
    case 'object': return this.sounds.indexOf(sound) >= 0;
    case 'string': return !!this.sounds[sound];
    default: return false;
  }
};

// Change `name` option to value.
SoundJSDirectorGroup.prototype.set = function setOption (name, value) {
  this.options[name] = value;
  return this;
};

// Get `name` option value.
SoundJSDirectorGroup.prototype.get = function getOption (name) {
  switch (name) {
    case 'name': return this.name;
    case 'sounds': return this.sounds;
    default: return this.options[name];
  }
};

// Custom .toString method.
SoundJSDirectorGroup.prototype.toString = function () {
  return '[SoundJSDirectorGroup]';
};


// Load all group sounds.
SoundJSDirectorGroup.prototype.load = function loadGroupSounds (onload) {

  var Sound = createjs.Sound,
      group = this,
      notLoadedURLs = [],
      notLoadedURLsLen = 0;

  // Find not loaded sounds by src property.
  this.eachSound(function (sound) {
    var src = sound.src;
    if (notLoadedURLs.indexOf(src) < 0 && !Sound.loadComplete(sound.src)) {
      notLoadedURLs[notLoadedURLsLen++] = src;
      return;
    }
  });

  // Optimization fix.
  if (!notLoadedURLsLen) {
    return this;
  }

  // Handle files loading.
  Sound.on('fileload', function onFileLoad (a) {
    var src = a.src,
        index = notLoadedURLs.indexOf(src);
    if (index < 0) {
      return;
    }
    notLoadedURLs.splice(index, 1);
    if (!notLoadedURLs.length) {
      Sound.off('fileload', onFileLoad);
      group.dispatchEvent('loaded');
    }
  });

  // Register loading callback.
  if ('function' === typeof onload) {
    group.on('loaded', function onLoaded (e) {
      group.off('loaded', onLoaded);
      onload(e);
    });
  }

  // Load files.
  SoundJSDirector.each(
    notLoadedURLs,
    Sound.registerSound,
    Sound
  );

  return this;

};


// Set @value for group.
SoundJSDirectorGroup.prototype.setLoop = function setGroupLoop (value) {
  this.set('loop', parseInt(value) || 0);
  return this;
};

// Switch group loop to 0 if it not 0 and -1 or @value if it is.
SoundJSDirectorGroup.prototype.switchLoop = function switchGroupLoop (value) {
  this.set('loop', this.get('loop') === 0 ? (parseInt(value) || -1) : 0);
  return this;
};

// Get loop option value of group.
SoundJSDirectorGroup.prototype.getLoop = function getGroupLoop () {
  return this.get('loop');
};


// Set @value state of sound muting.
SoundJSDirectorGroup.prototype.setMute = function setGroupMute (value) {
  this.eachSound(function (sound) {
    sound.setMute(value);
  });
  return this;
};

// Switch current sound mute state.
SoundJSDirectorGroup.prototype.switchMute = function switchGroupMute () {
  this.eachSound(function (sound) {
    sound.setMute(!sound.getMute());
  });
  return this;
};


// Set 'pan' property @value for playing/@all sounds in group
// but every sound (instance) considers all of its groups.
SoundJSDirectorGroup.prototype.setPan = function setGroupPan (value, all) {

  value = parseFloat(value) || 0.0;

  this.set('pan', value);

  SoundJSDirector.each(
    all ? this.sounds : this._playing,
    function (sound) {
      sound.setPan(this.getSoundPan(sound));
    }, 
    this
  );
  
  return this;
};

// Get 'pan' property of current group.
SoundJSDirectorGroup.prototype.getPan = function () {
  return this.get('pan');
};

// Compute 'pan' property of @sound.
SoundJSDirectorGroup.prototype.getSoundPan = function getSoundPan (sound, pan) {
  // TODO: get best pan computing (not sum, but vector).
  var count = 0;
  if (arguments.length <= 1) {
    pan = SoundJSDirector._defaults.pan;
  }
  SoundJSDirector.eachSoundGroup(sound, function (group) {
    pan += 1.0 + parseFloat(group.options.pan) || 0.0;
    count++;
  });
  return pan - count;
};


// Play instances (free/all/one by id/src) with @options.
// Usages:
// .play() - play all free sounds with group options.
// .play(id) - play only one instance (if exists) from group by id or src with group options.
// .play(id, options) - play only one instance (if exists) from group by id or src with custom @options extended by group options.
// .play(options, true) - play all (of group) sounds with @options extened by gropu options; @options can contain .id or .src for play only defined sound.
// .play(options) - play all free sounds with @options extended by group options; @options can contain .id or .src for play only defined sound; @options can contain .all property for select playing sounds from all group sounds (not only free sounds).
SoundJSDirectorGroup.prototype.play = function playGroup () {

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
        case 'object': options = arg0; id = options.id || options.src; all = options.all; break;
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
SoundJSDirectorGroup.prototype.playSound = function playGroupSound (id, options) {

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
SoundJSDirectorGroup.prototype._playSoundWithOptions = 
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
SoundJSDirectorGroup.prototype._playSounds = function playSounds (options, all) {
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
SoundJSDirectorGroup.prototype._playCollapsed = function playCollapsed (options, all) {
  var sound = SoundJSDirector.randomItem(all ? this.sounds : this._wait);
  if (sound) {
    this._playSoundWithOptions(sound, options);
  }
  return this;
};

// Pause all playing sounds.
SoundJSDirectorGroup.prototype.pause = function pauseGroup () {
  this.eachPlayingSound(function (sound) {
    sound.pause();
  });
  return this;
};

// Resume all paused group sounds.
SoundJSDirectorGroup.prototype.resume = function resumeGroup () {
  this.eachPlayingSound(function (sound) {
    sound.resume();
  });
  return this;
};

// Stop all playing group sounds.
SoundJSDirectorGroup.prototype.stop = function stopGroup (sounds) {

  switch (arguments.length) {
    case 0: sounds = null; break;
    case 1: {
      if (!(sounds instanceof(Array))) {
        sounds = [sounds];
      }
    } break;
    default: {
      sounds = SoundJSDirector.toArray(arguments);
    } break;
  }

  if (!(sounds && sounds.length)) {
    sounds = null;
  }

  this.eachPlayingSound(function (sound) {
    if (sounds &&
        (sounds.indexOf(sound) < 0 || 
          sounds.indexOf(sound.src) < 0 || 
          sounds.indexOf(sound.id) < 0))
    {
      return;
    }
    sound.stop();
    sound.dispatchEvent('stopped');
  });

  return this;
  
};



// Set @value position for every sound in group.
SoundJSDirectorGroup.prototype.setPosition = function setGroupPosition (value) {
  this.eachPlayingSound(function (sound) {
    sound.setPosition(value);
  });
  return this;
};

// Shortlink.
SoundJSDirectorGroup.prototype.seek = SoundJSDirectorGroup.prototype.setPosition;


// Set all sounds volume.
SoundJSDirectorGroup.prototype.setVolume = function setGroupVolume (value, all) {

  value = parseFloat(value) || 0.0;

  this.set('volume', value);

  SoundJSDirector.each(
    all ? this.sounds : this._playing,
    function (sound) {
      sound.setVolume(this.getSoundVolume(sound));
    },
    this
  );
  
  return this;

};

// Returns group volume level.
SoundJSDirectorGroup.prototype.getVolume = function () {
  return this.get('volume');
};

// Compute sound instance volume multiplied to groups volumes.
SoundJSDirectorGroup.prototype.getSoundVolume = function getSoundVolume (sound, volume) {
  if (arguments.length <= 1) {
    volume = SoundJSDirector._defaults.volume;
  }
  SoundJSDirector.eachSoundGroup(sound, function (group) {
    volume *= parseFloat(group.get('volume')) || 0.0;
  });
  return volume;
};


var OUT_EACH = SoundJSDirector.OUT_EACH = 'OUT_EACH';

// Apply @callback with passing each of collection item with index of collection.
SoundJSDirector.each = function (collection, callback, ctx) {

  if ('function' !== typeof callback || !collection || 'object' !== typeof collection) {
    return;
  }

  ctx = ctx || null;

  if (collection instanceof Array) {
    var _collection = collection.slice();
    for (var i = 0, len = _collection.length; i < len; i++) {
      if (OUT_EACH === callback.call(ctx, _collection[i], i)) {
        break;
      }
    }
  }
  else {
    for (var p in collection) {
      if (collection.hasOwnProperty(p)) {
        if (OUT_EACH === callback.call(ctx, collection[p], p)) {
          break;
        }
      }
    }
  }
  
};


// Extending @obj by another arguments (if they are objects too).
// For create not deep copy pass 'true' to last argument.
SoundJSDirector.extend = function extend (target) {

  var args = SoundJSDirector.toArray(arguments, 1),
      len = args.length,
      lastArg = args[len - 1],
      isNotDeep = lastArg !== true;
  
  if ('object' !== typeof target) {
    target = {};
  }
  
  if (!len) {
    args[0] = target;
    len = 1;
    target = {};
  }
  
  for (var i = 0, o, val, tVal; i < len; i++) {
  
    o = args[i];

    if ('object' !== typeof o) {
      continue;
    }
  
    for (var p in o) {

      val = o[p];
      tVal = target[p];

      if ((tVal || 'undefined' !== typeof tVal) || !o.hasOwnProperty(p) || val === null || 'undefined' === typeof val) {
        continue;
      }

      // Deep copy of object.
      if ('object' === typeof val && isNotDeep && val !== o) {
        target[p] = extend(val);
      }
      else {
        target[p] = val;
      }
    }
  
  }
  
  return target;

};


// Returns random item of @collection.
SoundJSDirector.randomItem = function (collection) {
  if ('object' === typeof collection) {
    if (collection instanceof Array) {
      var max = collection.length - 1;
      return collection[Math.round(max * Math.random())];
    }
    else {
      throw 'SoundJSDirector.randomItem cannot process objects';
    }
  }
};


// Move @item from @src collection to @dest.
SoundJSDirector.switchCollection = function (item, src, dest) {
  var index;
  while ((index = src.indexOf(item)) >= 0) {
    src.splice(index, 1);
  }
  if (dest) {
    dest[dest.length] = item;
  }
};


// toArray utillity converts @arg to array with slising from @num.
SoundJSDirector.toArray = (function (slice) {
  return function toArray (arg, num) {
    return slice.call(arg || [], num || 0);
  };
} ([].slice));


// Global groups collection by names.
var GROUPS = {};

// Group mixed getter/setter.
SoundJSDirector.group = function (name) {
  switch (name instanceof SoundJSDirector.Group) {
    case false: return GROUPS[name];
    // TODO: Check redefines for memory leaks.
    case true: return (GROUPS[name.name] = name);
  }
};

// Apply @callback with every group where sound is contain.
SoundJSDirector.eachSoundGroup = SoundJSDirector.prototype.eachSoundGroup = 
function eachSoundGroup (sound, callback) {
  SoundJSDirector.each(SoundJSDirector.getSoundGroups(sound), callback);
};

// Return array of group where sound is.
SoundJSDirector.getSoundGroups = SoundJSDirector.prototype.getSoundGroups = 
function getSoundGroups (sound) {
  if (!(sound && 'object' === typeof sound)) {
    return [];
  }
  return (sound._groups || (function () {
    var groups = sound._groups = [];
    SoundJSDirector.handleSoundsStates(sound);
    return groups;
  } ()));
};

// Add group to sound groups.
SoundJSDirector.setSoundGroup = SoundJSDirector.prototype.setSoundGroup = 
function setSoundGroup (sound, group) {

  if (!(sound && 'object' === typeof sound)) {
    return;
  }

  if ('string' === typeof group) {
    group = SoundJSDirector.group(group);
  }

  var soundGroups = SoundJSDirector.getSoundGroups(sound),
      sounds = group.sounds,
      Sound = createjs.Sound;

  soundGroups.push(group);
  sounds.push(sound);
  sounds[sound.id || sound.src] = sound;
  
  // Add sound to same with state group collection.
  switch (sound.playState) {
    default:
    case Sound.PLAY_INITED:
    case Sound.PLAY_FAILED:
    case Sound.PLAY_FINISHED:
    case Sound.PLAY_INTERRUPTED: {
      group._wait.push(sound);
    } break;

    case Sound.PLAY_SUCCEEDED: {
      group._playing.push(sound);
    } break;
  }

};

// Remove @sound from @group.
SoundJSDirector.unsetSoundGroup = SoundJSDirector.prototype.unsetSoundGroup =
function unsetSoundGroup (sound, group) {

  if (!(sound && 'object' === typeof sound)) {
    return;
  }

  if ('string' === typeof group) {
    group = SoundJSDirector.group(group);
  }

  var soundGroups = SoundJSDirector.getSoundGroups(sound),
      groupSounds = group.sounds,
      switchCollection = SoundJSDirector.switchCollection;

  switchCollection(group, soundGroups);
  switchCollection(sound, groupSounds);
  switchCollection(sound, group._wait);
  switchCollection(sound, group._playing);

  var id = sound.id,
      src = sound.src;

  if (sound === groupSounds[id]) {
    groupSounds[id] = null;
    delete groupSounds[id];
  }

  if (sound === groupSounds[src]) {
    groupSounds[src] = null;
    delete groupSounds[src];
  }
  
};

// Handle sound states and switch it between groups collections.
SoundJSDirector.handleSoundsStates = function (sound) {

  var unifyedGroupHandler = function (e) {

    var from, to;

    switch (e.type) {
      case 'stopped':
      case 'complete':
      case 'failed':
      case 'interrupted': {
        from = '_playing';
        to = '_wait';
      } break;

      case 'succeeded':
      case 'loop': {
        from = '_wait';
        to = '_playing';
      } break;
    }

    if (!(from && to)) {
      return;
    }
    
    var switchCollection = SoundJSDirector.switchCollection;
    SoundJSDirector.eachSoundGroup(sound, function (group) {
      switchCollection(
        sound,
        group[from],
        group[to]
      );
    });

  };

  sound.on('stopped', unifyedGroupHandler);
  sound.on('complete', unifyedGroupHandler);
  sound.on('failed', unifyedGroupHandler);
  sound.on('interrupted', unifyedGroupHandler);
  sound.on('loop', unifyedGroupHandler);
  sound.on('succeeded', unifyedGroupHandler);
  
};


SoundJSDirector._defaults = {
  volume: 1,
  loop: 0,
  delay: 0,
  offset: 0,
  pan: 0,
  collapsed: false,
  basePath: '',
  // priority: 0, // TODO: process in collapsed groups.
  // offsets: [0], // TODO: process offsets for every playing sound
};

var DEFAULT_OPTIONS_KEYS = Object.keys(SoundJSDirector._defaults);

// Returns object with only known options.
SoundJSDirector.parseOptions = function (obj) {
  var options = {};
  if ('object' === typeof obj) {
    for (var i = DEFAULT_OPTIONS_KEYS.length, key; i--; ) {
      key = DEFAULT_OPTIONS_KEYS[i];
      if (obj.hasOwnProperty(key)) {
        options[key] = obj[key];
      }
    }
  }
  return options;
};


} (window.createjs = window.createjs || {}));
