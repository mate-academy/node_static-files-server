'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const PORT = process.env.PORT || 3000;

const PUBLIC_FOLDER = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://localhost:${PORT}`);

  const parsedNormalizedURL = normalizedURL.pathname.slice(1) || 'index.html';

  if (parsedNormalizedURL.pathname.startsWith('/file/')) {
    const filePath = parsedNormalizedURL.pathname.replace('/file/', 'public/');

    const fullFilePath = path.join(PUBLIC_FOLDER, filePath || 'index.html');

    fs.access(fullFilePath, (exists) => {
      if (exists) {
        fs.readFile(fullFilePath, (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found.');
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('To load files, use the path starting with /file/');
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
