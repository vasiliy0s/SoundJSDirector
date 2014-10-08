'use strict';

// Returns random item of @collection.
SoundJSDirector.randomItem = function (collection) {
  if ('object' === typeof collection) {
    if (collection instanceof Array) {
      var max = collection.length - 1;
      return collection[Math.round(max * Math.random())];
    }
    else {
      throw 'SoundJSDirector.randomItem cannot process objects';
    }
  }
};
