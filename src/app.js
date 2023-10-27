'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const urlPath = req.url;

  if (urlPath.startsWith('/file/') && urlPath.length > 6) {
    const filePath = path.join(__dirname, 'public', urlPath.substring(6));

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hint: To load files, use URLs starting with "/file/".');
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
