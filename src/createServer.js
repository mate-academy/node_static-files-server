const fs = require('fs');
const path = require('path');
const http = require('http');

function createServer() {
  return http.createServer((req, res) => {
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
}

module.exports = {
  createServer,
};
