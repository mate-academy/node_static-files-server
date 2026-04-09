'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

function createServer() {
  const route = '/file';
  const publicDir = path.join(__dirname, '../public');

  const server = http.createServer(async (req, res) => {
    if (req.method !== 'GET') {
      res.statusCode = 404;

      return res.end('Not found');
    }

    res.setHeader('content-type', 'text/plain');

    const reqUrl = req.url;

    if (reqUrl.includes('//')) {
      res.statusCode = 404;

      return res.end('Path is not supported');
    }

    if (!reqUrl.startsWith(route)) {
      res.statusCode = 400;

      return res.end('Bad request');
    }

    if (!reqUrl.startsWith(`${route}/`)) {
      res.statusCode = 200;

      return res.end('Invalid route');
    }

    const publicPath = path.join(publicDir, reqUrl.slice(route.length));

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
