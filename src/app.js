'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}/`);
  const urlParts = normalizedUrl.pathname.slice(1).split('/');

  if (urlParts[0] !== 'file') {
    res.statusCode = 400;
    res.statusMessage = 'Wrong path';

    res.end('Request path must start with /file');

    return;
  }

  let filePath = `./src/public/${urlParts.slice(1).join('/')}`;

  if (filePath === './src/public/') {
    filePath = './src/public/index.html';
  }

  const fileType = filePath.split('.')[filePath.split('.').length - 1];
  let header = '';

  switch (fileType) {
    case 'html':
      header = 'text/html';
      break;
    case 'css':
      header = 'text/css';
      break;
    case 'js':
      header = 'text/javascript';
      break;
    case 'json':
      header = 'application/json';
      break;
    case 'png':
      header = 'image/png';
      break;
    case 'jpg':
      header = 'image/jpeg';
      break;
    case 'gif':
      header = 'image/gif';
      break;
    case 'ico':
      header = 'image/x-icon';
      break;
    case 'txt':
      header = 'text/plain';
      break;
    default:
      header = 'application/octet-stream';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.statusMessage = 'File not found';
      res.setHeader('Content-Type', 'text/plain');

      res.end('404 File not found');

      return;
    }

    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', header);

    res.end(data);
  });
});

// eslint-disable-next-line no-console
server.listen(3000, () => console.log('Server started on port 3000'));
