'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  if (!pathname.startsWith('/file/')) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid request. To load files, use a path starting with /file/');

    return;
  }

  const relativePath = path.join('public', pathname.slice('/file/'.length));

  const absolutePath = path.join(__dirname, '..', relativePath);

  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');

    return;
  }

  fs.readFile(absolutePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');

      return;
    }

    const contentType = getContentType(path.extname(absolutePath));

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});

function getContentType(fileExtension) {
  switch (fileExtension) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    default:
      return 'text/plain';
  }
}
