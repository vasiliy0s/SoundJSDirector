'use strict';

// Set all sounds volume.
SoundJSDirectorGroupProto.setVolume = function setGroupVolume (value, all) {

  value = parseFloat(value) || 0.0;

  this.options.volume = value;

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
SoundJSDirectorGroupProto.getVolume = function () {
  return this.options.volume;
};

// Compute sound instance volume multiplied to groups volumes.
SoundJSDirectorGroupProto.getSoundVolume = function getSoundVolume (sound) {
  var volume = 1.0;
  SoundJSDirector.eachSoundGroup(sound, function (group) {
    volume *= parseFloat(group.options.volume) || 0.0;
  });
  return volume;
};
