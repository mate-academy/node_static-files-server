'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  let fileName = normalizedURL.pathname.slice(1);

  if (fileName.startsWith('file')) {
    fileName = fileName.slice(5) || 'index.html';
  } else {
    res.end('Request should starts with "/file"');
  }

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (!err) {
      res.statusCode = 200;
      res.end(data);
    } else {
      res.statusCode = 404;
      res.write('Page not found');
    }
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
