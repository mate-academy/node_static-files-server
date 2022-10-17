/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.port || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const parts = normalizedURL.pathname.slice(1).split('/');

  if (parts[0] !== 'file') {
    res.write(
      '<h1>start your path with /file/ </h1>'
    );
  } else {
    const fileName = req.url.slice(1).replace(/file\//g, '');

    fs.readFile(`./src/public/${fileName}`, (error, data) => {
      if (!error) {
        res.end(data);
      }

      res.statusCode = 404;
      res.end();
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
