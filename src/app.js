'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathnameArray = normalizedUrl.pathname
    .split('/')
    .filter(path => path !== '');

  if (pathnameArray[0] !== 'file') {
    res.end('Correct request is: "/file/<path_to_file>"');

    return;
  }

  const filename = pathnameArray.slice(1).join('/') || 'index.html';

  fs.readFile(`./src/public/${filename}`, (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.statusCode = 404;
    res.statusMessage = 'Not Found';
    res.end();
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
