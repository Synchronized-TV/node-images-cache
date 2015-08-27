
import { defer } from 'q';
import request from 'request';

import image2base64 from 'image2base64';

require('request').debug = true

// most little pixel to prevent safari leak, see http://www.fngtps.com/2010/mobile-safari-image-resource-limit-workaround/
const PICO_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';


/**
 * convert an url to its base64 value and return promise
 * we use canvas here due to strange browserify+buffer issue, see https://gist.github.com/revolunet/4417e4168ae2879a3604
 * @method getUrlAsBase64
 * @param  {String}       url url if the ressource
 * @return {Promise}          return a promise that resolve on success with b64 data and rejects on error
 */
function getUrlAsBase64(url) {
  let deferred = defer();
  var img = new Image();
  img.onload = function() {
    deferred.resolve(image2base64(img));
    img.onload = img.onerror = null;
    img.src = PICO_PIXEL;
    img = null;
  }
  img.onerror = function() {
    deferred.reject();
    img.onload = img.onerror = null;
    img.src = PICO_PIXEL;
    img = null;
  };
  img.src = url;
  return deferred.promise;
}



class ImagesCache {
  constructor() {
    this.cache = {};
  }

  /**
   * load in cache a bunch of urls
   * @method loa
   * @param  {Array|String} urls list of urls, or single url to cache
   * @return {Promise}  return a promise with progress({loaded: x, total: y}) and resolved when all images loaded
   */
  load(urls) {
    if (typeof urls === 'string') {
      urls = [urls];
    }
    const nbImages = urls.length;
    let nbImagesLoaded = 0;
    let deferred = defer();

    function urlLoaded() {
      nbImagesLoaded++;
      deferred.notify({
        loaded: nbImagesLoaded,
        total: nbImages
      });
      if (nbImagesLoaded === nbImages) {
        deferred.resolve();
      }
    }

    urls.forEach(url => {
      if (!this.cache[url]) {
        // add resource to cache
        // always increment counter, even when image load failed
        getUrlAsBase64(url).then(b64 => {
          this.cache[url] = b64;
          urlLoaded();
        }).catch(e => {
          urlLoaded();
        })
      } else {
        // also notify when image already in cache
        urlLoaded();
      }
    });
    return deferred.promise;
    // optionaly cache on FS or whatever
    // handle http:// urls
    // handle bundle:// urls for cordova bundled files
  }
  get(url, addToCache=true) {
    let cached;
    if (cached = this.cache[url]) {
      return cached;
    } else {
      if (addToCache) {
        // todo : add to cache
      }
      return url;
    }
  }
  clear() {
    this.cache = {};
  }
}

const imagesCache = new ImagesCache();

export default imagesCache;
