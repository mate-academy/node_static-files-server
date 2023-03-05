'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const server = http.createServer(async(req, res) => {
  if (!req.url.startsWith('/file')) {
    res.end('pathname should start with `/file`');

    return;
  }

  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const fileName = normalizedUrl.pathname
    .replace(/\/file\/*/, '') || 'index.html';
  const filePath = path.join(__dirname, 'public', fileName);

  try {
    const file = await fs.readFile(filePath);

    res.end(file);
  } catch (err) {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(3000);
