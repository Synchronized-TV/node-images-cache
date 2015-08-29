import request from 'browser-request';

export default function getBase64Data(uri, callback) {
  request(
    {
      url: uri,
      encoding: null,
      withCredentials: false
    }, function (err, response, body) {
      if (err) {
        callback(err);
        return;
      }
      var type   = response.headers['content-type'];
      var base64 = body.toString('base64');
      var result = `data:${type};base64,${base64}`;
      callback(null, result);
    }
  );
};
