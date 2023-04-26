/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.port || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const filePath = normalizedURL.pathname;
  const fileName = filePath.slice(6) || 'index.html';

  if (!filePath.startsWith('/file')) {
    res.statusCode = 400;
    res.end('The pathname has to start with "/file/"');

    return;
  }

  fs.readFile(`../public/${fileName}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('File does not exist');

      return;
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
