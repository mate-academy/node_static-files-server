'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathName = normalizedUrl.pathname.slice(1) || 'index.html';

  if (!pathName.startsWith('/file')) {
    res.end('The pathname should starts with "/file"');
  }

  fs.readFile('./public' + pathName, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`running on ${PORT}`);
});
