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
  return (sound._groups || (sound._groups = []));
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
  var soundGroups = SoundJSDirector.getSoundGroups(sound);
  soundGroups.push(group);
  group.sounds.push(sound);
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
      index;
  while ((index = soundGroups.indexOf(group)) >= 0) {
    soundGroups.splice(index, 1);
  }
  while ((index = groupSounds.indexOf(sound)) >= 0) {
    groupSounds.splice(index, 1);
  }
};
