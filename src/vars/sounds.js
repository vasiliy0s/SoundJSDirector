'use strict';

var SOUNDS = {},
    SOUND_INSTANCES = [];

// 
SoundJSDirector.sound = function (name) {
  switch (typeof name) {
    case 'string': return SOUNDS[name];
    default: {
      var instance = name;
      name = instance.name;
      SOUNDS[name] = instance;
      SOUND_INSTANCES.push(instance);
    }
  }
};
