/* eslint-disable max-len */
'use strict';

const http = require('http');
const fs = require('fs');

const createServer = () => {
  const server = http.createServer((req, res) => {
    const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-Type', 'text/html');

    if (normalizedURL.pathname.slice(1).split('/')[0] !== 'file') {
      const message = 'You should request files using /file/*other dirs*/*your file*';

      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.end(message);
    }

    const replacedUrl = normalizedURL.pathname.split('file').join('public');

    if (!(fs.existsSync(replacedUrl))) {
      res.statusCode = 404;
      res.statusMessage = 'File is not exist';
      res.end();
    }

    if (fs.existsSync(replacedUrl)) {
      fs.readFile(replacedUrl, 'utf8', (err, data) => {
        if (!err) {
          res.end(data);
        }

        res.statusCode = 404;
        res.statusMessage = 'Cant read the file';
        res.end();
      });
    }
  });

  return server;
};

createServer();

module.exports = {
  createServer,
};
