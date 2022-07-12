'use strict';

const PORT = process.env.PORT || 8080;

const fs = require('fs');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(
    req.url,
    `http://${req.headers.host}`
  );

  let fileName = normalizedUrl.pathname.slice(1).split('/');

  if (fileName[0] !== 'file') {
    res.end(
      'In order to load a file your pathname should start with \'/file/\''
    );
  }

  fileName.shift();
  fileName = fileName.join('/') || 'index.html';

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
