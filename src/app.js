/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4200;
const publicFolder = path.join(__dirname, 'public');

function createServer() {
  return http.createServer((req, res) => {
    const filePath = getFilePath(req.url);

    if (!filePath) {
      res.writeHead(404);
      res.end('File not found');

      return;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');

        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  });
};

function getFilePath(url) {
  const filePart = url.split('/file/')[1];

  if (!filePart) {
    return path.join(publicFolder, 'index.html');
  }

  const filePath = path.join(publicFolder, filePart);

  if (!filePath.startsWith(publicFolder)) {
    return null;
  }

  return filePath;
}

const server = createServer();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
