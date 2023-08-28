'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const corectUrl = new URL(req.url, `http://${req.headers.host}`);

  if (!corectUrl.pathname.startsWith('/file')) {
    res.statusCode = 404;

    res.end('The pathname should start with "/file"');
  }

  const fileName = req.url.slice(6) || 'index.html';

  try {
    const data = fs.readFileSync(`./public/${fileName}`, 'utf-8');

    res.statusCode = 200;
    res.end(data);
  } catch (error) {
    res.statusCode = 404;
    res.end(`${fileName} non exist`);
  }
});

module.exports = {
  server,
};
