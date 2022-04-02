'use strict';

const http = require('http');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const [url, fileName] = req.url.slice(1).split(/\/(.*)/, 2);

  if (req.method !== 'GET' || url !== 'file') {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>Oops... no page found:(</h1>');
    res.write('<p>Did you mean to search for the files? ');
    res.write('To access them please use this ');
    res.write('<a href="/file">link</a>');
    res.end('</p>');

    return;
  }

  fs.readFile(`./public/${fileName || 'index.html'}`, (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
