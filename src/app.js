'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 3006;

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
  const fileName = normalizedUrl.pathname.slice(1) || 'index.html';

  fs.readFile(`.file/${fileName}`, (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });

  server.listen(PORT, () => {});
});
