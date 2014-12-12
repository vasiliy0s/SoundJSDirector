'use strict';

// Set 'pan' property @value for playing/@all sounds in group
// but every sound (instance) considers all of its groups.
SoundJSDirectorGroup.prototype.setPan = function setGroupPan (value, all) {

  value = parseFloat(value) || 0.0;

  this.options.pan = value;

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
  return this.options.pan;
};

// Compute 'pan' property of @sound.
SoundJSDirectorGroup.prototype.getSoundPan = function getSoundPan (sound, pan) {
  // TODO: get best pan computing (not sum, but vector).
  var count = 0;
  if (arguments.length <= 1) {
    pan = DEFAULT_OPTIONS.pan;
  }
  SoundJSDirector.eachSoundGroup(sound, function (group) {
    pan += 1.0 + parseFloat(group.options.pan) || 0.0;
    count++;
  });
  return pan - count;
};
