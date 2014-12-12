SoundJSDirector
===============

Manager for groupped and alone sounds in CreateJS/SoundJS with SoundJSDirector.

## Install

You can install this package via [bower](http://bower.io/):
```sh
bower install git@github.com:vasiliy0s/SoundJSDirector.git --save
```
And it will be install this package to your *bower_components* directory.

## Usage

After include of `soundjs-director.js` file to your site/app pages you can group sounds (with possible preloading) as in example:

```js
var SoundJSDirector = createjs.SoundJSDirector;

// Create new group with static options, add sounds and load.
new SoundJSDirector.Group('main', {volume: 0.5, collapsed: true})
  .add(['assets/sound1.js', 'assets/sound2.js'])
  .load();
  
// Play first free sound 3 times from previously defined group with custom options in another part of your code.
SoundJSDirector.group('main').play({offset: 1, loop: 3});
```

## API

### createjs.SoundJSDirector
SoundJSDirector is available in `createjs` global object as central manager point:
```js
var SoundJSDirector = createjs.SoundJSDirector;
```

It provides `new Group(name)` constructor, `.group(name)` getter and several utilities for library.

#### new SoundJSDirector.Group(name[, options])
This is the `named` sounds group definition with possible options:
```js
var group = new SoundJSDirector.Group('main', {
  volume: 1,
  loop: 0,
  delay: 0,
  offset: 0,
  pan: 0,
  collapsed: false,
  basePath: '',
});
```

In code you can see default group options. Most of options you can see is options for SoundJS instances playing and you can read about it in [documentation](http://www.createjs.com/Docs/SoundJS/classes/SoundInstance.html#method_play).

Option `collapsed` indicate for `.play()` method can play __only one sound of group__.

All of options can be temporary applyed on `.play()` method at once (_on call_) without changing group properties. But all of the options can be changed with `.set(name)` group method.

##### SoundJSDirectorGroup.set(name, value)
Set `name` of group option to `value`. **All of options will be applyed only with next actions.**

##### SoundJSDirectorGroup.get(name)
Returns `name` option of group or group name or group sounds.

##### SoundJSDirectorGroup.sound(id)
Returns sound by `id` or `src`.

##### SoundJSDirectorGroup.exists(sound)
Returns true if `sound` (src, id or SoundInstance) exists in group.

##### SoundJSDirectorGroup.add(manifest)
Add sounds from [`manifests`](http://www.createjs.com/Docs/SoundJS/classes/Sound.html#method_registerManifest) (or array of manifests) to group with `createjs.Sound.registerSound(manifest)` and create instances form it.

##### SoundJSDirectorGroup.join(SoundInstance)
Register `SoundInstance` in group for managing. This is not automatically stops joined instances. _(it using SoundJSDirector.setSoundGroup)_

##### SoundJSDirectorGroup.leave(SoundInstance)
Unregister `SoundInstance` from group.  This is not automatically stops joined instances. _(it using SoundJSDirector.unsetSoundGroup)_

##### SoundJSDirectorGroup.flush()
Ungergister all sounds from group.

##### SoundJSDirectorGroup.eachSound(callback[, ctx])
Apply `callback` funciton (with optional `ctx` context) with every group sound.

##### SoundJSDirectorGroup.eachSound(callback[, ctx])
Apply `callback` funciton (with optional `ctx` context) with every group sound.

##### SoundJSDirectorGroup.play()
Play all/random/specified sounds in group. Possible usage variants:
- `.play()` - play all (or random free, if group is collapsed) sounds in group;
- `.play(id)` - play sound in group with same `id`;
- `.play(id, options)` - play sound in group with same `id` with `options`, passing to playing instance and merged with group options;
- `.play(options[, true])` - play all (or random free, if group is collapsed) sound in group with options, passing to playing instace and merged with group options; `options` can contain `id` or `src` property for select custom sound from group; `true` indicates to force using already playing sounds and can be setted as `options.all` key;

##### SoundJSDirectorGroup.pause()
Pause every playing sound in group.

##### SoundJSDirectorGroup.resume()
Resume every playing sound in group.

##### SoundJSDirectorGroup.stop()
Stop every playing sound in group.

##### SoundJSDirectorGroup.setVolume(value[, all])
Set `value` volume for group sound. Use `all = true` for apply for all of group sound (with not currently playing).

##### SoundJSDirectorGroup.getVolume()
Returns group volume.

##### SoundJSDirectorGroup.getSoundVolume(SoundInstance, volume)
Compute volume based on `volume` value and all of joined groups settings.

#### SoundJSDirector.group(name)
Get defined group by `name` for manage.

## TODO:

- Complete README documentation.
- Force sounds loading when .play() is called.
- Create full-featured documentation with any autobuilder.
- Add tests.
- Add version to code.
- Add priorities for sounds.
- Add easings for playback and volume/pan/mute setting group operations.
- Complete another TODOs from code.
- TODO: pass Sound.INTERRUPT's to play() method.
- TODO: provide sounds events in group like 'playing', 'played', 'loaded', other...

## Author

[Vasiliy 0s](http://vasiliy0s.com/)

## Sorry
I am sorry for my bad English. If you see language errors in documentation, comments or code, please fix'n'contribute or tell me about.

## License

Apache License Version 2.0
