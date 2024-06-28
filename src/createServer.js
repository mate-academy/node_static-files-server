'use strict';

const http = require('http');
const fs = require('fs').promises;

async function handleRequest(req, res) {
  res.setHeader('Content-Type', 'text/plain');

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (!url.pathname.startsWith('/file') || url.pathname.includes('//')) {
      res.statusCode = url.pathname.includes('//') ? 404 : 400;

      res.end(
        url.pathname.includes('//')
          ? 'File not found'
          : 'Hint: To load files, use /file/<filename>',
      );

      return;
    }

    const filePath = `./public${url.pathname.replace('/file', '') || '/index.html'}`;
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
