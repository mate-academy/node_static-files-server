'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

  if (!normalizedUrl.pathname.startsWith('/file/')) {
    res.statusCode = 400;

    res.end('The pathname to your file should start with "/file"');
  }

  const fileName = req.url.slice(6) || 'index.html';

  fs.readFile(`./public/${fileName}`, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 400;

      res.end('The pathname to your file does not exist');
    }

    res.setHeader('Content-Type', 'text/plain');

    res.statusCode = 200;

    res.end(data);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
