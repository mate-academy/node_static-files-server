'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || '5001';

const server = http.createServer((req, res) => {
  if (req.url.slice(0, 6) !== '/file/') {
    // eslint-disable-next-line no-console
    console.log('Path to file should start from "/file/"');
    res.statusCode = 404;
    res.end();
  } else {
    const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
    const filePath = normalizedURL.pathname.slice(6);

    fs.readFile(`./src/public/${filePath}`, (error, data) => {
      if (!error) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running');
});
