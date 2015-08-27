# images-cache

![npm](https://img.shields.io/npm/v/images-cache.svg) ![license](https://img.shields.io/npm/l/images-cache.svg) ![github-issues](https://img.shields.io/github/issues/revolunet/images-cache.svg)

![nodei.co](https://nodei.co/npm/images-cache.png?downloads=true&downloadRank=true&stars=true)

Cache images as base64 for faster browser display

## Features

 - load a bunch of urls and notify progress via a promise
 - store these urls binary content as base64
 - fallback to original url when image not found in cache

## QuickStart

```js
import imagesCache from 'images-cache';

const images = [
  'http://path/to/image.jpg',
  'http://path/to/image2.jpg'
];

imagesCache.load(images).progress(status => {
  console.log('progress', status.loaded, status.total);
}).then(() => {
  imagesCache.get('http://path/to/image.jpg'); // -> returns the base64 version, ex: data:image/jpg;base64,...
  imagesCache.get('http://path/to/unknown/image.jpg'); // -> returns 'http://path/to/unknown/image.jpg'
}).done();
```

## API

 - `load(urls)`: load a bunch of urls and store internally as base64.
 - `get(url)`: return base64 version of an existing url, and return original url if not found in cache
 - `clear()`: empty the current cache

## Scripts

 - **npm run readme** : `node ./node_modules/node-readme/bin/node-readme.js`
 - **npm run test** : `find ./spec -iname '*.spec.js' -exec ./node_modules/.bin/babel-node {} \; | ./node_modules/.bin/tap-spec`
 - **npm run zuul** : `./node_modules/zuul/bin/zuul -- spec/**/*.spec.js`
 - **npm run build** : `./node_modules/.bin/browserify -t babelify ./src/index.js -o ./dist/index.js`
 - **npm run watch** : `./node_modules/.bin/watchify -t babelify ./src/index.js -o ./dist/index.js`

## Dependencies

Package | Version | Dev
--- |:---:|:---:
[imageurl-base64](https://www.npmjs.com/package/imageurl-base64) | 1.0.0 | ✖
[q](https://www.npmjs.com/package/q) | 1.4.1 | ✖
[babel](https://www.npmjs.com/package/babel) | 5.6.23 | ✔
[babel-eslint](https://www.npmjs.com/package/babel-eslint) | 3.1.23 | ✔
[babelify](https://www.npmjs.com/package/babelify) | 6.1.2 | ✔
[browserify](https://www.npmjs.com/package/browserify) | 11.0.1 | ✔
[eslint](https://www.npmjs.com/package/eslint) | 1.0.0-rc-1 | ✔
[eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) | 0.0.6 | ✔
[mockery](https://www.npmjs.com/package/mockery) | 1.4.0 | ✔
[node-readme](https://www.npmjs.com/package/node-readme) | 0.1.8 | ✔
[tap-spec](https://www.npmjs.com/package/tap-spec) | 4.0.2 | ✔
[tape](https://www.npmjs.com/package/tape) | 4.0.0 | ✔
[watchify](https://www.npmjs.com/package/watchify) | 3.3.1 | ✔
[zuul](https://www.npmjs.com/package/zuul) | 3.2.0 | ✔


## Author

Julien Bouquillon <julien@bouquillon.com> http://github.com/revolunet

## License

 - **MIT** : http://opensource.org/licenses/MIT
