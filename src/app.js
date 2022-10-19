'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const parts = normalizedURL.pathname.slice(1).split('/');

  if (parts[0] !== 'file') {
    res.end('Make sure the file path starts with "/file/"!');
  } else {
    const fileName = req.url.slice(1).replace(/file\//g, '');

    fs.readFile(`./public/${fileName}`, (error, data) => {
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
  console.log(`Server is running on http://localhost:${PORT}`);
});
