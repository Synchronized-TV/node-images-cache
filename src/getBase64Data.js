import xhr from 'xhr';
import btoa from 'btoa';

export default function getBase64Data(uri, callback) {
  xhr({
    method: 'GET',
    uri: uri,
    responseType: 'arraybuffer'
  }, function(err, resp, body) {
    if (resp.statusCode == 200) {
        if (callback) {
          var b64 = btoa(String.fromCharCode.apply(null, new Uint8Array(body)));
          var result = `data:${resp.headers['content-type']};base64,${b64}`;
          callback(null, result);
        }
      } else {
        callback(resp);
      }
  })
};
