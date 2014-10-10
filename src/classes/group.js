'use strict';

function SoundJSDirectorGroup (name, options) {
  
  var argsLen = arguments.length;
  
  if (1 === argsLen) {
    switch (typeof name) {
      case 'string': {
        options = SoundJSDirector.extend(DEFAULT_OPTIONS);
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

  var addingSounds = options.sounds;

  this.name = name;

  // Parse options.
  this.options = SoundJSDirector.extend(
    SoundJSDirector.parseOptions(options),
    DEFAULT_OPTIONS, 
    true
  );

  // Sound collections.
  this.sounds = [];
  this._playing = [];
  this._wait = [];
  
  if (addingSounds instanceof Array) {
    this.join(addingSounds);
  }

  // Register group for access by name.
  SoundJSDirector.group(this);

}

SoundJSDirector.Group = SoundJSDirector.prototype.Group = SoundJSDirectorGroup;

var SoundJSDirectorGroupProto = SoundJSDirectorGroup.prototype = new createjs.EventDispatcher();

// Add sounds with instances creation from SoundJS @manifest.
SoundJSDirectorGroupProto.add = function addSounds (manifests) {
  var Sound = createjs.Sound,
      instance;
  if (!(manifests instanceof Array)) {
    manifests = [manifests];
  }
  SoundJSDirector.each(
    SoundJSDirector.toArray(manifests),
    function (manifest) {
      manifest = ('object' === typeof manifest ? manifest : {'src': manifest});
      var res = Sound.registerSound(manifest, manifest.basePath);
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
SoundJSDirectorGroupProto.join = function joinGroup (sounds) {
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
SoundJSDirectorGroupProto.leave = function leaveGroup (sounds) {
  if (sounds instanceof Array) {
    SoundJSDirector.each(sounds, this.leave, this);
  }
  else if ('object' === typeof sounds) {
    SoundJSDirector.unsetSoundGroup(sounds, this);
  }
  return this;
};

// Call @callback (with @ctx) with every sound of group.
SoundJSDirectorGroupProto.eachSound = function eachSound (callback, ctx) {
  SoundJSDirector.each(this.sounds, callback, ctx || null);
};

// Call @callback (with @ctx) with every currently playing sound.
SoundJSDirectorGroupProto.eachPlayingSound = function eachPlayingSound (callback, ctx) {
  SoundJSDirector.each(this._playing, callback, ctx || null);
};

// Call @callback (with @ctx) with every currently not playing sound.
SoundJSDirectorGroupProto.eachWaitSound = function eachWaitSound (callback, ctx) {
  SoundJSDirector.each(this._wait, callback, ctx || null);
};

// Returns sound instance by id or src (as is setted in .add() method).
SoundJSDirectorGroupProto.sound = function getSound (sound) {
  return this.sounds[sound] || null;
};

// Check for sound instance exists in group;
SoundJSDirectorGroupProto.exists = function soundExists (sound) {
  switch (typeof sound) {
    case 'object': return this.sounds.indexOf(sound) >= 0;
    case 'string': return !!this.sounds[sound];
    default: return false;
  }
};
