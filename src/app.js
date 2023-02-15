'use strict';

const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const { pathname } = url;

  if (!pathname.startsWith('/file/')) {
    res.statusCode = 400;
    res.end('Invalid path. Please use a path starting with /file/');

    return;
  }

  const fileName = `public${pathname.slice('/file/'.length)}`;

  fs.readFile(fileName, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
