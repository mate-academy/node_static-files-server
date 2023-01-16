/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const pathname = normalizedURL.pathname;

  if (!pathname.startsWith('/file')) {
    res.end('The pathname should starts with "/file"');

    return;
  }

  const fileName = pathname.slice(1).split('/').slice(1).join('/')
    || 'index.html';

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end();
    } else {
      res.statusCode = 200;
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
