'use strict';

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
