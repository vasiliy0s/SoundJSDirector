'use strict';

// Set 'pan' property @value for playing/@all sounds in group
// but every sound (instance) considers all of its groups.
SoundJSDirectorGroupProto.setPan = function setGroupPan (value, all) {

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
SoundJSDirectorGroupProto.getPan = function () {
  return this.options.pan;
};

// Compute 'pan' property of @sound.
SoundJSDirectorGroupProto.getSoundPan = function getSoundPan (sound) {
  var pan = 0.0, count = 0;
  SoundJSDirector.eachSoundGroup(sound, function (group) {
    pan += 1.0 + parseFloat(group.options.pan) || 0.0;
    count++;
  });
  return pan - count;
};
