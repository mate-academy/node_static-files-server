'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (!pathname.startsWith('/file')) {
    res.end('This file doesn\'t exist');

    return;
  }

  const pathToFile = pathname
    .slice(1)
    .split('/')
    .slice(1)
    .join('/') || 'index.html';

  const dir = path.join(__dirname, `public/${pathToFile}`);
  const data = fs.readFileSync(dir, 'utf8');

  res.end(data);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
