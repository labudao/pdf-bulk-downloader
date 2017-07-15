var request = require('request');
var fs = require('fs');

const url = (urlPattern, n) => urlPattern.replace('[n]', n)
const dir = 'out\\';

const writeToFile = (body, fileName) => {
  const wstream = fs.createWriteStream(fileName);
  wstream.write(body);
  wstream.end();
}

const download = (urlPattern, n) => {
  const finalUrl = url(urlPattern, n);
  request({url: finalUrl, encoding: null}, function (error, response, body) {
    if (error) {
      console.error(error.code === 'ENOTFOUND' ? 'url not found: ' + finalUrl : 'unexpected error: ' + error.code);
      throw error;
    }
    if (body) {
      const leadingZero = n < 10 ? '0' : '';
      const fileName = dir + leadingZero + n + '.pdf';
      writeToFile(body, fileName);
      console.log(finalUrl + ' completed');
    }
  });
}

const validate = (urlPattern, from, to) => {
  if (!urlPattern.endsWith('.pdf')) {
    throw new Error('url must end with .pdf')
  }
  if (from > to) {
    throw new Error('from must be less or equal than to')
  }
}

const prepareOutputDir = (dir) => {
	try {
		let files = fs.readdirSync(dir)
		if (files.length > 0) {
			throw new Error('not empty dir: ' + dir);
		}
	}
	catch (error) {
		if (error.code === 'ENOENT') {
			fs.mkdirSync(dir);
			console.log('dir created: ', dir);
		}
		else {
			throw error;
		}
	}
}

const start = (urlPattern, from, to) => {
  validate(urlPattern, from, to)
	prepareOutputDir(dir)

	for (let i = from; i <= to; i++) {
		download(urlPattern, i);
	}
}

exports.start = start
