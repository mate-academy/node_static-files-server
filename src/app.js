/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const path = normalizedURL.pathname.slice(1).split('/');
  const fileFolder = path[0] === 'file' ? 'public/' : '';
  const fileName = path.slice(1).join('/') || 'index.html';

  fs.readFile(`./${fileFolder}${fileName}`, (err, data) => {
    if (!err) {
      res.end(data);
    } else {
      res.statusCode = 404;

      res.end('Pathname must be like: /file/file name');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
