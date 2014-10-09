'use strict';

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

    var switchCollection = SoundJSDirector.switchCollection;
    SoundJSDirector.eachSoundGroup(sound, function (group) {
      switchCollection(
        sound,
        group[from],
        group[to]
      );
    });

  };

  sound.on('complete', unifyedGroupHandler);
  sound.on('failed', unifyedGroupHandler);
  sound.on('interrupted', unifyedGroupHandler);
  sound.on('loop', unifyedGroupHandler);
  sound.on('succeeded', unifyedGroupHandler);
};
