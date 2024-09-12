/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const pathName = req.url;

    if (pathName.includes('//')) {
      res.statusCode = 404;

      res.end(`Don't use duplicated slashes!`);

      return;
    }

    if (!pathName.startsWith('/file')) {
      res.statusCode = 400;

      res.end('Please request files using /file prefix');

      return;
    }

    console.log('pathname', pathName);

    const fileName = pathName.slice(6) || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        res.end(data);
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
