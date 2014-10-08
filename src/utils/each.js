'use strict';

// Apply @callback with passing each of collection item with index of collection.
SoundJSDirector.each = function (collection, callback, ctx) {

  if ('function' !== typeof callback || !collection || 'object' !== typeof collection) {
    return;
  }

  var _collection = collection.slice();

  ctx = ctx || null;

  if (collection instanceof Array) {
    for (var i = 0, len = _collection.length; i < len; i++) {
      callback.call(ctx, _collection[i], i);
    }
  }
  else {
    for (var p in collection) {
      if (collection.hasOwnProperty(p)) {
      callback.call(ctx, _collection[p], p);
      }
    }
  }
  
};
