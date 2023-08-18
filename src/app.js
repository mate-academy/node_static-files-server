'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 5700;

const server = http.createServer((req, res) => {
  const base = req.url.slice(1).split('/');
  const checkedNameFile = base.includes('file')
    && req.url.slice(1).replace(/file/, 'public');
  const asd = checkedNameFile || req.url.slice(1);

  const normalizedUrl = new url.URL(asd, `http://${req.headers.host}`);
  const renameFile = normalizedUrl.pathname.slice(1)
    .replace(/public/, '').split('/')
    .filter(i => i !== '').join('/');

  const fileName = renameFile || 'index.html';

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('The path must start with /file/');
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  process.stdout.write(`http://localhost:${PORT}`);
});
