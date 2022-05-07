'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const requestURL = new URL(req.url, `http://${req.headers.host}`);

  const pathname = requestURL.pathname;

  if (!pathname.startsWith('/file')) {
    res.statusCode = 404;

    return res.end(`URL must be started with http://${req.headers.host}/file/`);
  }

  const fileName = pathname.replace('/file', '').slice(1) || 'index.html';
  const filePath = `public/${fileName}`;

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.statusCode = 404;

      res.write('Page not found');
    } else {
      res.write(data);
    }

    res.end();
  });
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
