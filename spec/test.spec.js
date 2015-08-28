'use strict';

import test from 'tape';

import mockery from 'mockery';

// mock the 'imageurl-base64' module
const getBase64DataMock = function(url, cb) {
	if (url === 'invalid') {
		cb('err');
		return;
	}
  cb(null, dummyData[url]);
};

mockery.enable({
    warnOnUnregistered: false
});
mockery.registerMock('getBase64Data', getBase64DataMock);

const dummyData = {
	'http://host/dummy.jpg': 'this.is.dummy.base64',
	'http://host/dummy2.jpg': 'this.is.dummy2.base64',
}

let imagesCache = require('../src');

test('load() with single url should add data to cache and get() should return base64', (t) => {
	let dummyUrl = 'http://host/dummy.jpg';
	t.plan(2);
	imagesCache.load(dummyUrl).then(function() {
		t.equal(Object.keys(imagesCache.cache).length, 1, 'cache should have a single entry');
		t.equal(imagesCache.get(dummyUrl), dummyData[dummyUrl], `base64 for ${dummyUrl} should equal ${dummyData[dummyUrl]}`);
	});
});

test('clear() should empty the cache', (t) => {
	t.plan(2);
	t.equal(Object.keys(imagesCache.cache).length, 1, `cache should have a single existing entry`);
	imagesCache.clear();
	t.equal(Object.keys(imagesCache.cache).length, 0, `cache should have 0 entries`);
});

test('load() with multiple url should add data to cache and get() should return base64', (t) => {
	imagesCache.clear();
	t.plan(1 + Object.keys(dummyData).length);
	imagesCache.load(Object.keys(dummyData)).then(function() {
		t.equal(Object.keys(imagesCache.cache).length, Object.keys(dummyData).length, `cache should have ${Object.keys(dummyData).length} entries`);
		Object.keys(dummyData).forEach(key => {
			t.equal(imagesCache.get(key), dummyData[key], `base64 for ${key} should equal ${dummyData[key]}`);
		});
	});
});

test('load() with invalid url should resolve too', (t) => {
	imagesCache.clear();
	t.plan(1);
	imagesCache.load('invalid').then(function() {
		t.pass(`ìnvalid url should resolve the promise too`);
	});
});

test('get() with unknown url should return original url', (t) => {
	imagesCache.clear();
	t.plan(1);
	t.equal(imagesCache.get('http://path/to/unknown'), 'http://path/to/unknown', `should return 'http://path/to/unknown'`);
});

test('load() should send progress notification and resolve', (t) => {
	imagesCache.clear();
	t.plan(2);
	let urls = Object.keys(dummyData);
	// invalid url should generate notifs too
	urls = urls.concat('invalid');
	let loaded = 0;
	imagesCache.load(urls).progress(function() {
		loaded++;
	}).then(function() {
		t.equal(loaded, urls.length, `promise should send ${urls.length} notifications`);
		t.pass(`promise should finally resolve`);
	});
});
