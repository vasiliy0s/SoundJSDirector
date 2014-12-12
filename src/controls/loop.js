'use strict';

// Set @value for group.
SoundJSDirectorGroup.prototype.setLoop = function setGroupLoop (value) {
  this.set('loop', parseInt(value) || 0);
  return this;
};

// Switch group loop to 0 if it not 0 and -1 or @value if it is.
SoundJSDirectorGroup.prototype.switchLoop = function switchGroupLoop (value) {
  this.set('loop', this.get('loop') === 0 ? (parseInt(value) || -1) : 0);
  return this;
};

// Get loop option value of group.
SoundJSDirectorGroup.prototype.getLoop = function getGroupLoop () {
  return this.get('loop');
};
