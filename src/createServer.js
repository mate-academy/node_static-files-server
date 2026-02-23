'use strict';

const http = require('http');
const path = require('path');
const fsp = require('fs/promises');

const createServer = () => {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const isValidURL = /^\/file/.test(url.pathname);

    res.setHeader('Content-Type', 'text/plain');

    if (!isValidURL) {
      res.statusCode = 400;
      res.end('Invalid URL. Correct request is: "/file/<PATH_TO_THE_FILE>".');

      return;
    }

    const requestedPath =
      url.pathname.replace(/^\/file\/?/, '') || 'index.html';

    const realPath = path.resolve('public', requestedPath);

    try {
      const file = await fsp.readFile(realPath, 'utf-8');

      res.statusCode = 200;
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });
};

module.exports = { createServer };
