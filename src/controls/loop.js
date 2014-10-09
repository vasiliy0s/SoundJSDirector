'use strict';

// Set @value for group.
SoundJSDirectorGroupProto.setLoop = function setGroupLoop (value) {
  this.options.loop = parseInt(value) || 0;
  return this;
};

// Switch group loop to 0 if it not 0 and -1 or @value if it is.
SoundJSDirectorGroupProto.switchLoop = function switchGroupLoop (value) {
  var options = this.options,
      loop = options.loop;
  options.loop = loop === 0 ? (parseInt(value) || -1) : 0;
  return this;
};
