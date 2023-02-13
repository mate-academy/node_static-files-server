'use strict';

const fs = require('fs');
const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizeURL = new URL(req.url, `http://${req.headers.host}`);
  const filePath = normalizeURL.pathname.slice(1);
  const filePathArr = filePath.split('/');

  if (filePathArr[0] !== 'file') {
    res.end('the path should start with "/file/"');

    return;
  }

  const fileName = filePathArr.slice(1).join('/') || 'index.html';

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, (err) => {
  if (!err) {
    // eslint-disable-next-line no-console
    console.log(`Server run on http://localhost:${PORT}`);
  }
});
