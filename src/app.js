'use strict';

const http = require('http');
const { readFile } = require('fs').promises;
const { join } = require('path');
const mime = require('mime');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async(req, res) => {
  const normalizeURL = new URL(req.url, `http://${req.headers.host}`);

  const [prefix, ...pathParts] = normalizeURL.pathname
    .slice(1)
    .split('/')
    .filter(Boolean);

  if (prefix !== 'file') {
    res.end('Write a correct address - e.g.: /file/path/to/file/main.js');

    return;
  }

  if (!pathParts.length) {
    pathParts.push('index.html');
  }

  try {
    const filePath = join(__dirname, '..', 'public', ...pathParts);
    const contentType = mime.getType(filePath);

    const fileData = await readFile(filePath, 'utf-8');

    res.setHeader('Content-Type', contentType);

    res.end(fileData);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);

    res.statusCode = 404;
    res.statusMessage = 'Non existent file';
    res.end();
  }
});

server.listen(PORT, (error) => {
  if (!error) {
    // eslint-disable-next-line no-console
    console.log(`server run on http://localhost:${PORT}`);
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
  }
});
