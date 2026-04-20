'use strict';

const http = require('http');
const fsp = require('fs/promises');
const url = require('url');
// const path = require('path');

function createServer() {
  /* Write your code here */
  return http.createServer(async (req, res) => {
    const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
    const normalizedPath =
      normalizedURL.pathname.replace(/^\/file\//, '') || 'index.html';

    // Check for invalid paths first
    if (!normalizedURL.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Invalid file path');
    }

    // Check for path traversal attempts
    if (normalizedURL.pathname.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Invalid file path');
    }

    if (normalizedURL.pathname.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end();
    }

    if (!normalizedURL.pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('All routes must starts with /file/');
    }

    try {
      const file = await fsp.readFile(`./public/${normalizedPath}`, 'utf-8');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(file);
    } catch (error) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Not Found');
    }
  });
}

module.exports = {
  createServer,
};
