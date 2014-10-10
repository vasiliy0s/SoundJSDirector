SoundJSDirector
===============

Manager for groupped and alone sounds in CreateJS/SoundJS with SoundJSDirector.

## Install

You can install this package via [bower](http://bower.io/).
```sh
bower install git@github.com:vasiliy0s/SoundJSDirector.git
```

## Usage

After include of `soundjs-director.js` file to your site/app pages you can group sounds (with possible preloading) with syntax:

```js
var SoundJSDirector = createjs.SoundJSDirector;
new SoundJSDirector.Group('main', {volume: 0.5, collapsed: true}).add(['assets/sound1.js', 'assets/sound2.js']);
setTimeout(function () {
  SoundJSDirector.group('main').play({offset: 1, loop: 3});
}, 1000);
```

This code initialize new group named 'main', add two sounds to it (using array of SoundJS manifests) and play first (because `collapsed` options it _true_) sound after timeout (needs to load sounds).

## API

Sorry, API docs is not completed at now but you can use
```js
console.debug(createjs.SoundJSDirector.group('main'));
```
for view current available API in JavaScript _console_.

## TODO

- Create basic README documentation.
- Create full-featured documentation with any autobuilder.
- Change description of package.
- Add version to code.
- 

## Author

[Vasiliy 0s](http://vasiliy0s.com/)

## License

Apache License Version 2.0
