/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  const pureFile = normalizedURL.pathname.slice(6) || 'index.html';

  if (!normalizedURL.pathname.startsWith('/file/')) {
    res.statusCode = HTTP_BAD_REQUEST;
    res.end('Please, use /file/ for the correct file path.');

    return;
  }

  try {
    const filePath = `./public/${pureFile}`;

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');

      res.statusCode = HTTP_OK;
      res.end(data);
    } else {
      res.statusCode = HTTP_NOT_FOUND;
      res.end('File not found');
    }
  } catch (error) {
    console.error('Error reading file:', error);
    res.statusCode = HTTP_INTERNAL_SERVER_ERROR;
    res.end('Internal Server Error');
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
