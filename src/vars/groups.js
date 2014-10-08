'use strict';

// Global groups collection by names.
var GROUPS = SoundJSDirector.groups = {};

// Group mixed getter/setter.
SoundJSDirector.group = function (name) {
  switch (name instanceof SoundJSDirector.Group) {
    case false: return GROUPS[name];
    case true: return (GROUPS[name.name] = name);
  }
};
