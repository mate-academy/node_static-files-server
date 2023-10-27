'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3050;
const PUBLIC_FOLDER = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');

    return;
  }

  let filePath;

  if (url === '/file' || url === '/file/') {
    filePath = path.join(PUBLIC_FOLDER, 'index.html');
  } else if (url.startsWith('/file/')) {
    filePath = path.join(PUBLIC_FOLDER, url.slice(6));
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid URL format. Use /file/<filename>');

    return;
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');

      return;
    }

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server is running on http://localhost:${PORT}`);
});
