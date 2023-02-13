'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = '';
  const pathnameToCorrect = normalizedUrl.pathname.startsWith('/file');

  if (pathnameToCorrect) {
    pathname = `../public/${normalizedUrl.pathname.slice(6) || 'index.html'}`;
  } else {
    res.end(
      'Current pathname is wrong.'
      + 'Please correct your request according to example path'
      + '"/file/<FILE_NAME>"'
    );
  }

  fs.readFile(pathname, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
