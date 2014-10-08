/**
 * SoundJS Director v0.0.0
 * Manager for groupped and alone sounds in CreateJS/SoundJS with SoundJSDirector
 * by Vasiliy Os <talk@vasiliy0s.com>
 */

;(function (createjs) {

'use strict';

// TODO: new SoundJSDirector.Group() - constructor of sound groups.
// TODO: new SoundJSDirector.Sound() - contructor-wrapper for soun instances with depended by group settings methods.
// TODO: new SoundJSDirector.Manager() - manager with scoped registered groups, sounds and package applyers.
// TODO: events in group like single sound.
// TODO: SoundJSDirector.setGroups() - register groups of sounds.
// TODO: SoundJSDirector.setSounds() - register sounds (with initialization or loading).
// TODO: Group.play(options) - play all sounds in group.
// TODO: Group.stop(options) - -/-.
// TODO: Group.pause() - -/-.
// TODO: Group.setVolume() - -/-.
// TODO: Group.getVolume() - -/-, etc.
// TODO: autoinclude to PreloadJS as plugin if it possible.

var SoundJS = createjs.SoundJS = createjs.SoundJS || {};

function SoundJSDirector (/* config */) {
  // TODO: initalize with @config.
}

SoundJS.Director = SoundJSDirector;

createjs.SoundJSDirector = SoundJSDirector;

var DirectorProto = SoundJSDirector.prototype = new createjs.EventDispatcher();

DirectorProto._sendEvent = function (type) {
  var event = new createjs.Event(type);
  this.dispatchEvent(event);
};


// TODO: add events for methods.

function SoundJSDirectorGroup (name, options) {
  var argsLen = arguments.length;
  if (1 === argsLen) {
    name = options.name;
  }
  else if (0 === argsLen) {
    throw 'SoundJSDirector.Group there is no passed arguments';
  }
  this.name = name;
  options = this.options = SoundJSDirector.extend({}, options, DEFAULT_OPTIONS);
  this.sounds = [];
  var addingSounds = options.sounds;
  if (addingSounds instanceof Array) {
    for (var i = addingSounds.length; i--; ) {
      this.addSound(addingSounds[i]);
    }
  }
}

SoundJSDirector.Group = SoundJSDirector.prototype.Group = SoundJSDirectorGroup;

var SoundJSDirectorGroupProto = SoundJSDirectorGroup.prototype = new createjs.EventDispatcher();

SoundJSDirectorGroupProto.join = function joinGroup (sound) {
  if (sound instanceof Array) {
    for (var i = sound.length; i--; ) {
      this.join(sound[i]);
    }
    return this;
  }
  SoundJSDirector.setSoundGroup(sound, this);
  this.sounds.push(sound);
  return this;
};

SoundJSDirectorGroupProto.leave = function leaveGroup (/*sound*/) {
  // body...
  return this;
};

SoundJSDirectorGroupProto.play = function playGroup () {
  // TODO
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

SoundJSDirectorGroupProto.setVolume = function setGroupVolume (volume) {
  // TODO
  
  var options = options;

  volume = parseFloat(volume);
  
  if (volume === options.volume) {
    return this;
  }
  
  var sounds = this.sounds, 
      len = sounds.length;

  if (!len) {
    return this;
  }
  
  for (var i = len, sound; i--; ) {
    sound = sounds[i];
    sound.setVolume(sound.getGroupVolume());
  }
  
  return this;

};

SoundJSDirectorGroupProto.setLoop = function setGroupLoop () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.setPan = function setGroupPan () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.setMute = function setGroupMute () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.setUnmute = function setGroupUnumte () {
  // TODO
  return this;
};

SoundJSDirectorGroupProto.switchMute = function switchGroupMute () {
  // TODO
  return this;
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
  
  for (var i = 0, o, val; i < len; i++) {
  
    o = args[i];

    if ('object' !== typeof o) {
      continue;
    }
  
    for (var p in o) {

      val = o[p];

      if (!o.hasOwnProperty(p) || val === null || 'undefined' === typeof val) {
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
    case true: return (GROUPS[name.name] = name);
  }
};

// Return array of group where sound is.
SoundJSDirector.getSoundGroups = function (sound) {
  if (!(sound && 'object' === typeof sound)) {
    return [];
  }
  return (sound._groups || (sound._groups = []));
};

// Add group to sound groups.
SoundJSDirector.setSoundGroup = function (sound, group) {
  if (!(sound && 'object' === typeof sound)) {
    return;
  }
  if ('string' === typeof group) {
    group = SoundJSDirector.group(group);
  }
  var soundGroups = SoundJSDirector.getSoundGroups(sound);
  soundGroups.push(group);
};


/*jshint unused:false*/

var DEFAULT_OPTIONS = {
  volume: 1,
  loop: 0,
  delay: 0,
  offset: 0,
  pan: 0,
};


var SOUNDS = {},
    SOUND_INSTANCES = [];

// 
SoundJSDirector.sound = function (name) {
  switch (typeof name) {
    case 'string': return SOUNDS[name];
    default: {
      var instance = name;
      name = instance.name;
      SOUNDS[name] = instance;
      SOUND_INSTANCES.push(instance);
    }
  }
};


} (window.createjs = window.createjs || {}));
