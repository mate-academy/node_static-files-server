/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

  // const fileName = normalizedUrl.pathname.slice(1) || 'index.html';

  let newPath = normalizedUrl.pathname;

  if (newPath.includes('/file/')) {
    newPath = newPath.replace('/file/', '');
  }
  console.log(newPath.includes('/file'));

  if (newPath.includes('/file')) {
    newPath = newPath.replace('/file', '');
  }
  console.log(newPath);
  newPath = newPath || 'index.html';

  console.log(normalizedUrl);

  // if newPath
  fs.readFile(`./public/${newPath}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
