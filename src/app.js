'use strict';
/* eslint-disable no-console */

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);

  const fileName = normalizedURL.pathname.slice(6) || 'index.html';

  if (!normalizedURL.pathname.startsWith('/file/')) {
    res.statusCode = 404;

    res.end(
      'To load files, use the /file/ prefix followed by the path to the file.'
    );
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;

      res.end(
        'The wrong way. Non existent files',
      );
    } else {
      res.statusCode = 200;
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = server;
