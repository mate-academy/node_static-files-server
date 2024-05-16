'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

function createServer() {
  return http.createServer((req, res) => {
    const normilizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
    const pathToFile = normilizedUrl.pathname;

    if (req.url.includes('/app.js')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');
      res.end('there is no such file');

      return;
    }

    if (pathToFile.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('there is no such file');

      return;
    }

    let restOfPath = '../public/';

    if (pathToFile.includes('file')) {
      const verifiedPath = pathToFile.slice(6);

      restOfPath += verifiedPath;

      if (!verifiedPath.length) {
        restOfPath += 'index.html';
      }
    }

    const fullPath = path.join(__dirname, restOfPath);

    fs.readFile(fullPath, { encoding: 'utf8' }, (err, data) => {
      // eslint-disable-next-line no-console
      console.log(err);

      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('request should starts with "file"');

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      res.end(data);
    });
  });
}

module.exports = {
  createServer,
};
