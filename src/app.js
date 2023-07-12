'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = pathname.slice(1).split('/');

  if (pathParts[0] !== 'file') {
    res.end('The file path must start with "/file/"');

    return;
  }

  const pathToFile = pathParts.slice(1).join('/') || 'index.html';

  fs.readFile(`./public/${pathToFile}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('404 Error: File not found');
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  process.stdout.write(`Server is running on http://localhost:${PORT}\n`);
});
