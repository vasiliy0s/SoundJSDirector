'use strict';

// Global groups collection by names.
var GROUPS = {};

// Group mixed getter/setter.
SoundJSDirector.group = function (name) {
  switch (name instanceof SoundJSDirector.Group) {
    case false: return GROUPS[name];
    case true: return (GROUPS[name.name] = name);
  }
};

// Apply @callback with every group where sound is contain.
SoundJSDirector.eachSoundGroup = function (sound, callback) {

  if ('function' !== typeof callback) {
    return;
  }
  
  var args = SoundJSDirector.toArray(callback, 1),
      groups = SoundJSDirector.getSoundGroups(sound);
  
  args.unshift(null, null);
  
  for (var i = groups.length; i--; ) {
    args[0] = groups[i];
    args[1] = i;
    callback.apply(null, args);
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
