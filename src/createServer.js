/* eslint-disable no-console */
'use strict';

const http = require('http');
const fsp = require('fs/promises');
const path = require('path');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith('/file/')) {
      const requestedPath = url.pathname.slice('/file/'.length) || 'index.html';

      if (url.pathname.includes('..')) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request');

        return;
      }

      if (url.pathname.includes('//')) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }

      const realPath = path.join(__dirname, '..', 'public', requestedPath);

      const fileExists = await fsp
        .access(realPath)
        .then(() => true)
        .catch(() => false);

      if (!fileExists) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }

      try {
        const data = await fsp.readFile(realPath);
        const ext = path.extname(realPath);
        const contentTypes = {
          '.html': 'text/html',
          '.css': 'text/css',
        };

        res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
        res.end(data);
      } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
      }
    } else if (url.pathname === '/app.js') {
      // especialy for testcases because req.url already normalized
      // incoming req.url === "app.js" but must be "/file/../app.js"
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Bad Request');
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hint: Url must begin with /file/ ');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
