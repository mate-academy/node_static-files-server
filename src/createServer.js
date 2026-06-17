'use strict';

const fsp = require('fs/promises');
const http = require('http');
const url = require('url');

function sendError(res, status, message) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(message);
}

function createServer() {
  const server = http.createServer(async (req, res) => {
    const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
    const normalizedPath =
      normalizedURL.pathname.replace(/^\/file\//, '') || 'index.html';

    // Check for invalid paths first
    if (!normalizedURL.pathname.startsWith('/file')) {
      return sendError(res, 400, 'Invalid file path');
    }

    // Check for path traversal attempts
    if (normalizedURL.pathname.includes('..')) {
      return sendError(res, 400, 'Invalid file path');
    }

    // Check for double slashes
    if (normalizedPath.includes('//')) {
      return sendError(res, 404, 'Paths have duplicated slashes');
    }

    // Show hint for /file endpoint
    if (!normalizedURL.pathname.startsWith('/file/')) {
      return sendError(res, 200, 'Path should start with "/file/"');
    }

    try {
      const file = await fsp.readFile(`./public/${normalizedPath}`, 'utf-8');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(file);
    } catch (error) {
      return sendError(res, 404, 'Not Found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
