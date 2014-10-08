'use strict';

// toArray utillity converts @arg to array with slising from @num.
SoundJSDirector.toArray = (function (slice) {
  return function toArray (arg, num) {
    return slice.call(arg || [], num || 0);
  };
} ([].slice));
