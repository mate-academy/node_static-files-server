'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const BASE_URL = `http://${req.headers.host}`;
  const normalizedUrl = new url.URL(req.url, BASE_URL).pathname;
  let fileName = normalizedUrl.slice(1).replace('file/', '');

  if (normalizedUrl === '/favicon.ico') {
    return;
  }

  if (fileName === '' || fileName === 'file') {
    fileName = 'index.html';
  }

  if (!normalizedUrl.includes('/file')) {
    res.end('go to /file/ to load files');
  } else {
    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (err) {
        req.statusCode = 404;
        // eslint-disable-next-line
        console.log(err);
        res.end();
      } else {
        res.end(data);
      }
    });
  }
});

server.listen(8000);

module.exports = { server };
