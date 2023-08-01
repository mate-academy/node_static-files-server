/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { getContentType } = require('./getContentType');

const PORT = process.env.PORT || 8800;

const server = http.createServer((req, res) => {
  const normilizedURL = new URL(req.url, `http://${req.headers.host}`);
  const partOfPath = normilizedURL.pathname.slice(1).split('/');

  if (partOfPath[0] !== 'file') {
    res.end('Path must start with /file');

    return;
  }

  const fileName = partOfPath.slice(1).join('/') || 'index.html';

  const absolutePath = path.join(
    __dirname, `public/${fileName}`,
  );

  fs.readFile(absolutePath, 'utf-8', (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    const extension = path.extname(absolutePath);
    const contentType = getContentType(extension);

    res.setHeader('Content-type', contentType);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
