/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);

  if (!normalizedURL.pathname.startsWith('/file/')) {
    res.statusCode = 400;
    res.end('Pathname should start from "/file/"');

    return;
  }

  const fileName
    = normalizedURL.pathname.slice(6) || 'index.html';

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('The file does not exist');
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
