'use strict';

const http = require('http');
const fs = require('fs/promises');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const label = process.env.LABEL || '/file/';
  const filename = url.pathname.startsWith(label)
    ? url.pathname.slice(label.length)
    : 'index.html';

  fs.readFile(`public/${filename}`)
    .then((data) => {
      res.end(data);
    })
    .catch((err) => {
      res.statusCode = err.code === 'ENOENT' ? 404 : 418;
      res.end();
    });
});

server.listen(PORT);
