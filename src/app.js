'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const pathToFile = normalizedURL.pathname.slice(1);

  if (pathToFile.split('/')[0] !== 'file') {
    res.end('Pathname must contain "/file" at the beginning');

    return;
  }

  const mainPath = path
    .join(__dirname, '/public/' + pathToFile
      .split('/')
      .slice(1)
      .join('/')
    );

  fs.readFile(mainPath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('Page not found');

      return;
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on: http://localhost:' + PORT);
});
