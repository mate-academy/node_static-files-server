'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (!normalizedUrl.pathname.startsWith('/file')) {
    res.end('The file should start with /file');
  }

  const fileName = normalizedUrl.pathname
    .split('/')
    .slice(2)
    .join('/')
    || 'index.html';

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is listening on port ${PORT}`);
});
