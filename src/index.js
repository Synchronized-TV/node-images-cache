
import urlToBase64 from 'imageurl-base64-revolunet';
import { defer } from 'Q';

class ImagesCache {
  constructor() {
    this.cache = {};
  }
  /**
   * use imageurl-base64 to convert an url to its base64 and return promise.
   * @method _addUrlToCache
   * @param  {String}       url url to the ressource
   * @return {Promise}          return a promise that resolve on success and rejects on error
   */
  _addUrlToCache(url) {
    let deferred = defer();
    urlToBase64({
      url: url,
      withCredentials: false
    }, function(err, data) {
      if (err) {
        //console.error('unable to load ' + url, err);
        deferred.reject(err);
        return;
      }
      deferred.resolve(data);
    });
    return deferred.promise;
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
        this._addUrlToCache(url).then(result => {
          this.cache[url] = result.dataUri;
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
