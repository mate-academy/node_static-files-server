/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3006;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://localhost:${PORT}`);
  let pathName = normalizedURL.pathname;

  if (!pathName.includes('/file')) {
    res.statusCode = 404;

    res.end('Use the /file/ prefix to load files.');

    return;
  }

  if (pathName === '/file' || pathName === '/file/') {
    pathName = path.join(pathName, 'index.html');
  }

  const fileName = pathName.substring('/file/'.length);

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (!err) {
      res.end(data);
    } else {
      res.statusCode = 404;
      res.end('File does not exist');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
