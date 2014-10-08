'use strict';

function SoundJSDirectorGroup (name, options) {
  this.name = name;
  this.options = SoundJSDirector.extend({}, DEFAULT_OPTIONS, options);
}

SoundJSDirector.Group = SoundJSDirector.prototype.Group = SoundJSDirectorGroup;
