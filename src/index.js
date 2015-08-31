
import { defer, denodeify, all, when } from 'q';
import getBase64Data from './getBase64Data';
import qlimit from 'qlimit';

const MAX_CONCURRENT_DOWNLOADS = 5;

var downloadLimit = qlimit(MAX_CONCURRENT_DOWNLOADS);
var getBase64DataPromise = denodeify(getBase64Data);

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

    if (urls.length === 0) {
      return when();
    }
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

    let urlsToFetch = [];
    urls.forEach(url => {
      if (!this.cache[url]) {
        // add resource to cache
        urlsToFetch.push(url);
      } else {
        // also notify if image already in cache
        urlLoaded();
      }
    });

    // limit concurrent downloads
    all(urlsToFetch.map(downloadLimit(url => {
      // always increment counter, even when download failed
      return getBase64DataPromise(url).then(b64 => {
        this.cache[url] = b64;
      }).finally(() => {
        urlLoaded();
      });
    })));

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
