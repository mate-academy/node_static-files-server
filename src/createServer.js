'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');

function createServer() {
  const fileServer = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    if (req.url.includes('//')) {
      res.statusCode = 404;

      return res.end('Double slashes are prohibited!');
    }

    if (req.url.includes('..')) {
      res.statusCode = 400;

      return res.end('Access denied!');
    }

    const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

    if (!normalizedURL.pathname.startsWith('/file')) {
      res.statusCode = 400;

      return res.end(
        'Hint: to download a file from public dir, use /file/ prefix',
      );
    }

    const filePath =
      normalizedURL.pathname.replace('/file', '') || 'index.html';

    const finalPath = path.join(__dirname, '../public', filePath);
    const publicDir = path.resolve(__dirname, '../public');

    if (!finalPath.startsWith(publicDir)) {
      res.statusCode = 400;

      return res.end('Access denied!');
    }

    fs.readFile(finalPath, 'utf8')
      .then((data) => {
        res.statusCode = 200;

        res.end(data);
      })
      .catch(() => {
        res.statusCode = 404;

        res.end('File not found!');
      });
  });

  return fileServer;
}

axios.get('http://localhost:5701/file/index.html').then(() => {});

module.exports = {
  createServer,
};
