'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 3006;

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
  let message;

  if (normalizedUrl
    .pathname.slice(1).split('/')[0].localeCompare('file') === 0) {
    message = '';
  } else {
    message = 'Start pathname with /file/';
  }

  const fileName = normalizedUrl
    .pathname.slice(1).split('/').slice(1).join('/') || 'index.html';

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (!message.length) {
      res.end(message);
    }

    if (!err) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });

  server.listen(PORT, () => {});
});
