'use strict';

/*jshint unused:false*/

var DEFAULT_OPTIONS = {
  volume: 1,
  loop: 0,
  delay: 0,
  offset: 0,
  pan: 0,
  collapsed: false,
  basePath: '',
  // priority: 0, // TODO: process in collapsed groups.
  // offsets: [0], // TODO: process offsets for every playing sound
};

var DEFAULT_OPTIONS_KEYS = Object.keys(DEFAULT_OPTIONS);

// Returns object with only known options.
SoundJSDirector.parseOptions = function (obj) {
  var options = {};
  if ('object' === typeof obj) {
    for (var i = DEFAULT_OPTIONS_KEYS.length, key; i--; ) {
      key = DEFAULT_OPTIONS_KEYS[i];
      if (obj.hasOwnProperty(key)) {
        options[key] = obj[key];
      }
    }
  }
  return options;
};
