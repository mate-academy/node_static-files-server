const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const requestedPath = pathname.replace('/file', '') || 'index.html';
    const realPath = path.join(__dirname, '..', 'public', requestedPath);

    res.setHeader('Content-Type', 'text/plain');

    if (!pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Routes not starting with /file/');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Paths having duplicated slashes');

      return;
    }

    fs.readFile(realPath, 'utf-8', (err, file) => {
      if (err) {
        res.statusCode = 404;
        res.end('Non-existent files');

        return;
      }
      res.statusCode = 200;
      res.end(file);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
