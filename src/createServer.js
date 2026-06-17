const http = require('http');
const url = require('url');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    const pathname = normalizedUrl.pathname.slice(1) || 'index.html';

    res.setHeader('Content-Type', 'text/plain');

    if (!req.url.startsWith('/file')) {
      res.statusCode = 400;

      res.end();

      return;
    }

    if (!req.url.startsWith('/file/')) {
      res.end('hint message');

      return;
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;

      res.end();

      return;
    }

    const path = pathname.slice(5);

    if (!fs.existsSync(`public/${path}`)) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    fs.readFile(`public/${path}`, (err, data) => {
      if (!err) {
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end(err.message);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
