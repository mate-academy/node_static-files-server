/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const paths = url.pathname.slice(1).split('/');

  const fileFolder = paths[0] === 'file' ? 'public/' : '';

  const file = paths.slice(1).join('/') || 'index.html';

  fs.readFile(`./${fileFolder}${file}`, (err, data) => {
    if (!err) {
      res.end(data);
    } else {
      res.statusCode = 404;

      paths[0] !== 'file'
        ? res.end('Pathname must start with /file/')
        : res.end();
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
