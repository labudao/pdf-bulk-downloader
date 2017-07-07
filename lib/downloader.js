var https = require('https');
var fs = require('fs');

const url = (urlPattern, n) => urlPattern.replace('[n]', n)
const dir = 'out\\';
fs.mkdirSync(dir);

const download = (urlPattern, n) => {
  const leadingZero = n < 10 ? '0' : '';
  const wstream = fs.createWriteStream(dir + leadingZero + n + '.pdf');
  const finalUrl = url(urlPattern, n);
  https.get(finalUrl, (res) => {
      if (res.statusCode !== 200) {
        wstream.end();
        throw new Error('request failed with error ' + `${res.statusCode}`);
      }
      res.on('data', function(data) {
        wstream.write(data);
      }).on('end', function() {
        console.log(finalUrl + ' completed');
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
  if (!urlPattern.endsWith('.pdf')) {
    throw new Error('url must end with .pdf')
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
