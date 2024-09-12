/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function createServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = req.url
        ? new URL(req.url, `http://${req.headers.host}`).pathname
        : '/';

      // const traversalPattern = /\/\.\.\//;

      const filePath = urlPath.slice(5);

      const publicDir = path.join(__dirname, '../public');
      const fullPath = path.join(publicDir, filePath);

      const traversalPattern = /\.\.\//;
      const pattern = /\/{2,}/;

      console.log(req.url);

      if (!urlPath.startsWith('/file/')) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Routes should start with /file/');

        return;
      }

      if (traversalPattern.test(req.url)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid file path.');

        return;
      }

      if (pattern.test(req.url)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Invalid file path.');

        return;
      }

      // console.log(res);

      // console.log(traversalPattern.test(urlPath));

      // if (traversalPattern.test(urlPath)) {
      //   res.writeHead(400, { 'Content-Type': 'text/plain' });
      //   res.end('Invalid file path.');

      //   return;
      // }

      try {
        const stats = await fs.stat(fullPath);

        if (stats.isFile()) {
          const fileContent = await fs.readFile(fullPath);

          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(fileContent);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not a file.');
        }
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found.');
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error.');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
