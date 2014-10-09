'use strict';

// Move @item from @src collection to @dest.
SoundJSDirector.switchCollection = function (item, src, dest) {
  var index;
  while ((index = src.indexOf(item)) >= 0) {
    src.splice(index, 1);
  }
  if (dest) {
    dest[dest.length] = item;
  }
};
