
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3006;

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  if (pathname.startsWith('/file')) {
    const editedPathname = pathname.slice(6) || 'index.html';

    fs.readFile(`./public/${editedPathname}`, (err, data) => {
      if (!err) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.statusText = 'Not Found';
        res.end('Requested file doesn\'t exist');
      }
    });
  } else {
    res.statusCode = 400;
    res.statusText = 'Bad request';
    res.end('Wrong request, try using /file/ as prefix in path');
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
