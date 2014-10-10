'use strict';

var OUT_EACH = SoundJSDirector.OUT_EACH = 'OUT_EACH';

// Apply @callback with passing each of collection item with index of collection.
SoundJSDirector.each = function (collection, callback, ctx) {

  if ('function' !== typeof callback || !collection || 'object' !== typeof collection) {
    return;
  }

  var _collection = collection.slice();

  ctx = ctx || null;

  if (collection instanceof Array) {
    for (var i = 0, len = _collection.length; i < len; i++) {
      if (OUT_EACH === callback.call(ctx, _collection[i], i)) {
        break;
      }
    }
  }
  else {
    for (var p in collection) {
      if (collection.hasOwnProperty(p)) {
        if (OUT_EACH === callback.call(ctx, _collection[p], p)) {
          break;
        }
      }
    }
  }
  
};
