const http = require('http');
const path = require('path');
const fs = require('fs');

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

const getContentType = (filePath) => {
  const extname = path.extname(filePath).toLowerCase();

  return CONTENT_TYPES[extname] || 'application/octet-stream';
};

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(`http://${req.headers.host}${req.url}`);
    const requestedPath =
      pathname.replace('/file', '').slice(1) || 'index.html';
    const publicPath = path.join(__dirname, '..', 'public');
    const realPath = path.resolve(publicPath, requestedPath);

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Double slashes in the URL are not allowed.');

      return;
    }

    if (pathname === '/file') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('To load files, use the /file/ path with the file name.');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('To load files, use the /file/ path');

      return;
    }

    if (!realPath.startsWith(publicPath)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Path traversal detected');

      return;
    }

    fs.readFile(realPath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File not found');

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', getContentType(realPath));
      res.end(data);
    });
  });
}

module.exports = { createServer };
