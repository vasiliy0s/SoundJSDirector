'use strict';

// Extending @obj by another arguments (if they are objects too).
// For create not deep copy pass 'true' to last argument.
SoundJSDirector.extend = function extend (target) {

  var args = SoundJSDirector.toArray(arguments, 1),
      len = args.length,
      lastArg = args[len - 1],
      isNotDeep = lastArg !== true;
  
  if ('object' !== typeof target) {
    target = {};
  }
  
  if (!len) {
    args[0] = target;
    len = 1;
    target = {};
  }
  
  for (var i = 0, o, val; i < len; i++) {
  
    o = args[i];

    if ('object' !== typeof o) {
      continue;
    }
  
    for (var p in o) {

      val = o[p];

      if (!o.hasOwnProperty(p) || val === null || 'undefined' === typeof val) {
        continue;
      }

      // Deep copy of object.
      if ('object' === typeof val && isNotDeep && val !== o) {
        target[p] = extend(val);
      }
      else {
        target[p] = val;
      }
    }
  
  }
  
  return target;

};
