'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

// const MIME_TYPES = {
//   '.html': 'text/html; charset=utf-8',
//   '.js': 'application/javascript; charset=utf-8',
//   '.css': 'text/css; charset=utf-8',
//   '.json': 'application/json; charset=utf-8',
//   '.png': 'image/png',
//   '.jpg': 'image/jpeg',
//   '.jpeg': 'image/jpeg',
//   '.gif': 'image/gif',
//   '.svg': 'image/svg+xml; charset=utf-8',
//   '.txt': 'text/plain; charset=utf-8',
// };

// function getMimeType(filePath) {
//   return (
//     MIME_TYPES[path.extname(filePath).toLowerCase()] ||
//     'application/octet-stream'
//   );
// }

function createServer() {
  // const publicDir = path.resolve(__dirname, '../public');

  const server = http.createServer((req, res) => {
    const { pathname } = new URL(`http://${req.headers.host}${req.url}`);
    const requestedPath =
      pathname.replace('/file', '').slice(1) || 'index.html';
    const realPath = path.join(__dirname, '..', 'public', requestedPath);

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('To load files, use the /file/ path');

      return;
    }

    if (pathname === '/file') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('To load files, use the /file/ path');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 400;
      res.end('To load files, use the /file/ path');

      return;
    }

    fs.readFile(realPath, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);

        return;
      }
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end('File not found');
    });
  });

  return server;
}

module.exports = {
  createServer,
};
