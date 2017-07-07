var https = require('https');
var fs = require('fs');

const url = (urlPattern, n) => urlPattern.replace('[n]', n)
const dir = 'out\\';
fs.mkdirSync(dir);

const download = (urlPattern, n) => {
  const leadingZero = n < 10 ? '0' : '';
  const wstream = fs.createWriteStream(dir + leadingZero + n + '.pdf');
  https.get(url(urlPattern, n), (res) => {
      res.on('data', function(data) {
        wstream.write(data);
      }).on('end', function() {
        console.log(n + ' completed');
        wstream.end();
      }).on('error', function() {
        console.log('error during ' + n, res.statusCode);
        wstream.end();
    });
  });
}

const validate = (urlPattern, from, to) => {
  if (!urlPattern.startsWith('https://')) {
    throw new Error('url must start with https://')
  }
  if (from > to) {
    throw new Error('from must be greater than to')
  }
}

const start = (urlPattern, from, to) => {
  validate(urlPattern, from, to)
  for (let i = from; i <= to; i++) {
    download(urlPattern, i);
  }
}

exports.start = start
