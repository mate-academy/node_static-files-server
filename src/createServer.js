/* eslint-disable no-console */
'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs/promises');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const pathName = normalizedUrl.pathname;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    if (!pathName.startsWith('/file')) {
      res.statusCode = 400;

      return res.end(
        'should return 400 for traversal paths' +
          'hint message for routes not starting with /file/"',
      );
    }

    if (pathName.includes('//')) {
      res.statusCode = 404;

      return res.end('should return 404 for paths having duplicated slashes');
    }

    const fileName = pathName.replace(/^\/file\/*/, '');

    try {
      const fileData = await fs.readFile(
        `./public/${fileName || 'index.html'}`,
      );

      res.end(fileData);
    } catch (error) {
      res.statusCode = 404;
      res.end('should return 404 for non-existent files');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
