'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { URL_PATHS } = require('./enums');

function createServer() {
  const publicDir = path.join(__dirname, '../public');

  const server = http.createServer(async (req, res) => {
    res.setHeader('content-type', 'text/plain');

    const sanitizedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (sanitizedUrl.pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('Not found');
    }

    const urlPathParts = sanitizedUrl.pathname.split('/');

    if (urlPathParts[1] !== URL_PATHS.FILE) {
      res.statusCode = 400;

      return res.end('Path is not supported');
    }

    if (urlPathParts.length <= 2) {
      res.statusCode = 200;

      return res.end('Invalid route');
    }

    const publicPath = path.join(publicDir, urlPathParts.slice(2).join('/'));

    try {
      const data = await fs.readFile(`${publicPath}`);

      res.statusCode = 200;

      return res.end(data);
    } catch (err) {
      res.statusCode = 404;

      return res.end('Not found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
