'use strict';

// Load all group sounds.
SoundJSDirectorGroupProto.load = function loadGroupSounds (onload) {

  var Sound = createjs.Sound,
      group = this,
      notLoadedURLs = [],
      notLoadedURLsLen = 0;

  // Find not loaded sounds by src property.
  this.eachSound(function (sound) {
    var src = sound.src;
    if (notLoadedURLs.indexOf(src) < 0 && !Sound.loadComplete(sound.src)) {
      notLoadedURLs[notLoadedURLsLen++] = src;
      return;
    }
  });

  // Optimization fix.
  if (!notLoadedURLsLen) {
    return this;
  }

  // Handle files loading.
  Sound.on('fileload', function onFileLoad (a) {
    var src = a.src,
        index = notLoadedURLs.indexOf(src);
    if (index < 0) {
      return;
    }
    notLoadedURLs.splice(index, 1);
    if (!notLoadedURLs.length) {
      Sound.off('fileload', onFileLoad);
      group.dispatchEvent('loaded');
    }
  });

  // Register loading callback.
  if ('function' === typeof onload) {
    group.on('loaded', function onLoaded (e) {
      group.off('loaded', onLoaded);
      onload(e);
    });
  }

  // Load files.
  SoundJSDirector.each(
    notLoadedURLs,
    Sound.registerSound,
    Sound
  );

  return this;

};
