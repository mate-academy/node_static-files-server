'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.port || 8080;

const server = http.createServer((req, res) => {
  let fileName = req.url.slice(1).replace('file', '') || 'index.html';

  if (fileName.includes('/') && fileName.length < 2) {
    fileName = 'index.html';
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (!error) {
      res.end(data);
    }

    res.statusCode = 404;

    res.end('Sample: http://localhost:8080/file/index.html');
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
