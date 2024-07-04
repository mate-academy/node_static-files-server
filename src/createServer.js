'use strict';

const http = require('http');
const fs = require('fs').promises;

async function handleRequest(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  try {
    const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

    if (
      !normalizedURL.pathname.startsWith('/file') ||
      normalizedURL.pathname.includes('//')
    ) {
      res.statusCode = normalizedURL.pathname.includes('//') ? 404 : 400;

      res.end(
        normalizedURL.pathname.includes('//')
          ? 'File not found'
          : 'Hint: "/file/<FILE_NAME>"',
      );

      return;
    }

    const filePath = `./public${normalizedURL.pathname.replace('/file', '') || '/index.html'}`;
    const data = await fs.readFile(filePath);

    res.statusCode = 200;
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end('File not found');
  }
}

const createServer = () => http.createServer(handleRequest);

module.exports = { createServer };
