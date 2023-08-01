'use strict';
/* eslint-disable max-len */

const http = require('http');
const fs = require('fs');

const createServer = () => {
  const server = http.createServer((req, res) => {
    const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

    const { pathname } = normalizedURL;

    const isCorrectFolder = pathname.startsWith('/file')
      || pathname.replace(/\//g, '').length === 0;

    if (!isCorrectFolder) {
      res.statusCode = 404;
      res.statusMessage = 'Page not found';
      res.end('<h1>To get the file, you need to specify "/file/..." at the beginning of the path. For example, if you need the styles.css file, enter: ".../file/styles.css" instead of ".../styles.css"</h1>')

      return;
    }

    const fileName = normalizedURL.pathname.replace(/^\/file(\/)?|\/$/, '')
      || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('<h1>Page not found</h1>');

        return;
      }

      res.statusCode = 200;
      res.end(data);
    });
  });

  return server;
};

module.exports = { createServer };
