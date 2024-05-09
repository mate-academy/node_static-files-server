'use strict';
'use strict';

const http = require('node:http');
const path = require('path');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const fileName = pathname.replace('/file/', '') || 'index.html';

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Double slashes are not allowed in the URL.');
      return;
    }

    if (pathname === '/file/' || pathname === '/file') {
      res.statusCode = 200;
      res.end(
        'Path should start with /file/. Correct path is: "/file/<FILE_NAME>".',
      );
      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;
      res.end('Request should not contain traversal paths.');
      return;
    }

    const publicPath = path.join(__dirname, '..', 'public');
    const filePath = path.join(publicPath, fileName);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File was not found.');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  });
}

module.exports = {
  createServer,
};
