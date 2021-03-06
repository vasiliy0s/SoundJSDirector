'use strict';

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
