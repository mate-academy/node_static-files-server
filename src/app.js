/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.port || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const filePath = normalizedURL.pathname;
  const fileName = filePath.slice(6) || 'index.html';
  const absolutePath = path.join(path.dirname(__dirname), 'public', fileName);

  if (!filePath.startsWith('/file')) {
    res.statusCode = 400;
    res.end('The pathname has to start with "/file/"');

    return;
  }

  fs.readFile(absolutePath, (err, data) => {
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
