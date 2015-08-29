'use strict';

import test from 'tape';
import mockery from 'mockery';

mockery.enable({
	useCleanCache: true,
	warnOnUnregistered: false
});

let requestMockArgs = null;
const requestMock = function(options, cb) {
	requestMockArgs = Array.prototype.slice.call(arguments);
	if (options.url === 'valid') {
		cb(null, {
			headers: {
				'content-type': 'image/test'
			}
		},
		'abc');
		return;
	}
	else if (options.url === 'invalid') {
		cb('err');
		return;
	}
};

mockery.registerMock('browser-request', requestMock);
var getBase64Data = require('../src/getBase64Data');

test('getBase64Data() should call request with correct parameters', (t) => {
	t.plan(1);
	getBase64Data('valid', function(err, base64) {});
	var expected = {
		url: 'valid',
		encoding: null,
		withCredentials: false
	};
	t.deepEqual(requestMockArgs[0], expected, `should equal ${JSON.stringify(expected)}`);
});

test('getBase64Data() should return valid base64 for given binary url', (t) => {
	t.plan(2);
	var expected = 'data:image/test;base64,abc';
	getBase64Data('valid', function(err, base64) {
		t.equal(err, null, `err should be null`);
		t.equal(base64, expected, `base64 should equal ${expected}`);
	});
});

test('getBase64Data() should return error for faulty url', (t) => {
	t.plan(1);
	getBase64Data('invalid', function(err, base64) {
		t.notEqual(err, null, `err should be defined`);
	});
});
