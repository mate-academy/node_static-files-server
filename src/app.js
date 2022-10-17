/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (normalizedUrl.pathname.slice(0, 5) !== '/file') {
    res.end(
      'Make sure the file path starts with /file/'
    );
  }

  let fileName = normalizedUrl.pathname.replace('/file', '') || 'index.html';

  if (fileName === '/') {
    fileName = 'index.html';
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => (
  console.log(`Server is running on http://localhost:${PORT}`)
));
