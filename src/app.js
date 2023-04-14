/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.port || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const filePath = normalizedURL.pathname;
  const fileName = path.basename(filePath) || 'index.html';
  const dirName = path.dirname(filePath);

  if (dirName !== '/file') {
    res.end('The pathname has to start with "/file/"');

    return;
  }

  fs.readFile(`./src/public/${fileName}`, (err, data) => {
    if (err) {
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
