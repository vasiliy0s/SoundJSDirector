'use strict';

function SoundJSDirector () {
  throw 'SoundJSDirector cannot be initialized. Use \'new SoundJSDirector.Group\' for manage sounds';
}

createjs.SoundJSDirector = SoundJSDirector;

SoundJSDirector.prototype = new createjs.EventDispatcher();

SoundJSDirector.prototype._sendEvent = function (type) {
  var event = new createjs.Event(type);
  this.dispatchEvent(event);
};

SoundJSDirector.prototype.toString = function () {
  return '[SoundJSDirector]';
};
