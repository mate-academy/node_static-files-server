/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 8080;

function staticServer() {
  const server = http.createServer((req, res) => {
    const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);

    if (normalizedURL.pathname.startsWith('/file')) {
      const fileName = (normalizedURL.pathname === '/file'
      || normalizedURL.pathname === '/file/')
        ? 'index.html'
        : normalizedURL.pathname.replace('/file/', '');

      fs.readFile(`./public/${fileName}`, (err, data) => {
        if (!err) {
          res.end(data);
        }

        res.statusCode = 404;
        res.end();
      });
    } else {
      res.statusCode = 400;
      res.end('Invalid request. Please use paths starting with "/file/".');
    }
  });

  server.listen(PORT, () => {
    console.log(`Server is running on http//localhost:${8080}`);
  });

  return server;
}

staticServer();

module.exports = { staticServer };
