'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.argv[2] || 8080;

http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const doesFilePartExist = normalizedUrl.pathname.split('/')[1] === 'file';
  const partialPathToFile = normalizedUrl.pathname
    .split('/')
    .slice(2)
    .filter(Boolean);
  const pathToFile = partialPathToFile.length === 0
    ? 'public/index.html'
    : ['public', ...partialPathToFile].join('/');

  if (!doesFilePartExist) {
    res.statusMessage = 'your request should'
      + ' look in following way /file/index.html';

    res.end(
      'your request should look in following way /file/index.html,'
      + ' use part /file/',
    );

    return;
  }

  if (!fs.existsSync(pathToFile)) {
    res.statusCode = 404;
    res.end('the file does not exist');

    return;
  }

  const file = fs.readFileSync(pathToFile);

  res.end(file);
}).listen(PORT);
