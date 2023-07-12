'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { getContentType } = require('./getContentType');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = pathname.slice(1).split('/');

  if (pathParts[0] !== 'file') {
    res.end('The file path must start with "/file/"');

    return;
  }

  const pathToFile = pathParts.slice(1).join('/') || 'index.html';
  const absolutePath = path.join(__dirname, '..', `public/${pathToFile}`);

  fs.readFile(absolutePath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('404 Error: File not found');

      return;
    }

    const ext = path.extname(absolutePath);
    const contentType = getContentType(ext);

    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
});

server.listen(PORT, () => {
  process.stdout.write(`Server is running on http://localhost:${PORT}\n`);
});
