/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  const pathParts = normalizedURL.pathname.slice(1).split('/');

  const fileName = pathParts[0] === 'file'
    ? pathParts.slice(1).join('/') || 'index.html'
    : 'wrongPathname.html';

  fs.readFile(`../public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
