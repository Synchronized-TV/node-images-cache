import xhr from 'xhr';

export default function getBase64Data(uri, callback) {
  xhr(
    {
      uri: uri,
      responseType: 'arraybuffer',
      withCredentials: false
    }, function (err, response, body) {
      if (err) {
        callback(err);
        return;
      }
      var type   = response.headers['content-type'];
      var base64 = new Buffer(body, 'binary').toString('base64');
      var result = `data:${type};base64,${base64}`;
      callback(null, result);
    }
  );
};
