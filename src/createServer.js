'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const hasDoubleSlashRegex = /\/\//g;

    if (hasDoubleSlashRegex.test(req.url)) {
      res.statusCode = 404;
      res.statusMessage = 'URL has double slashes';
      res.end();

      return;
    }

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = normalizedUrl.pathname.slice(1);

    if (fs.existsSync(path.resolve(__dirname, pathname))) {
      res.statusCode = 400;
      res.statusMessage = 'URL has traversal paths';
      res.end();

      return;
    }

    if (!normalizedUrl.pathname.startsWith('/file/')) {
      res.setHeader('Content-Type', 'text/plain');
      res.end('Pathname should start with "/file/" to load a file');

      return;
    }

    const pathnameNoFile =
      pathname === 'file' || pathname === 'file/'
        ? 'index.html'
        : pathname.replace('file/', '');
    const filePath = path.resolve(__dirname, `../public/${pathnameNoFile}`);

    const checkFile = async () => {
      try {
        const file = await fs.promises.readFile(filePath);

        res.write(file);
        res.end();
      } catch (error) {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('File is not exist');
      }
    };

    checkFile();
  });

  return server;
}

module.exports = {
  createServer,
};
