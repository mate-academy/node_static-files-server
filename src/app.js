/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (!url.pathname.startsWith('/file')) {
    res.statusCode = 400;
    res.statusMessage = 'Bad request';

    res.end('Invalid request! Paste the address in format "/file/filename"');

    return;
  }

  const fileName = url.pathname.slice(6) || 'index.html';

  fs.readFile(`src/public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.statusMessage = 'Not Found';

      res.end('Such file does not exist!');

      return;
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
