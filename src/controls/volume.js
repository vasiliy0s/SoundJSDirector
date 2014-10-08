'use strict';

// Set all sounds volume.
SoundJSDirectorGroupProto.setVolume = function setGroupVolume (volume) {
  
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
    sound.setVolume(this.getSoundVolume(sound));
  }
  
  return this;

};

// Compute sound instance volume multiplied to groups volumes.
SoundJSDirectorGroupProto.getSoundVolume = function getSoundVolume (sound) {
  var volume = sound.getVolume() || 0.0;
  SoundJSDirector.eachSoundGroup(sound, function (group) {
    volume *= group.options.volume || 0.0;
  });
  return volume;
};
