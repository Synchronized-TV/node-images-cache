
import { defer, denodeify } from 'q';
import getBase64Data from './getBase64Data';


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
        denodeify(getBase64Data)(url).then(b64 => {
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
