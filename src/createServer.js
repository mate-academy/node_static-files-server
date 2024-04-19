'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs/promises');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    if (!normalizedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;

      return res.end('Pathname should start with "/file/"');
    }

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('Error');
    }

    const filePath = normalizedUrl.pathname.replace(/^\/file\/*/, '');

    try {
      const fileData = await fs.readFile(
        `./public/${filePath || 'index.html'}`,
      );

      res.end(fileData);
    } catch (_) {
      res.statusCode = 404;
      res.end('File not found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
