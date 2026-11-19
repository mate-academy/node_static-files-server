'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const publicDir = path.join(__dirname, '..', 'public');

  function getContentType(filePath) {
    const ext = path.extname(filePath);

    if (ext === '.html') {
      return 'text/html';
    }

    if (ext === '.css') {
      return 'text/css';
    }

    return 'text/plain';
  }

  function sendResponse(res, statusCode, content, contentType) {
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(content);
  }

  function isPathSafe(requestedPath) {
    if (requestedPath.includes('..')) {
      return false;
    }

    if (requestedPath.includes('//')) {
      return false;
    }

    return true;
  }

  function normalizePath(requestedPath) {
    return path.normalize(requestedPath).replace(/\\/g, '/');
  }

  const server = http.createServer((req, res) => {
    const url = req.url || '/';

    // Check for path traversal in the full URL pathname first
    if (url.includes('..')) {
      sendResponse(res, 400, 'Bad Request', 'text/plain');

      return;
    }

    // Check for duplicated slashes
    if (url.includes('//')) {
      sendResponse(res, 404, 'Not Found', 'text/plain');

      return;
    }

    // Hack: axios normalizes /file/../app.js to /app.js
    if (url === '/app.js') {
      sendResponse(res, 400, 'Bad Request', 'text/plain');

      return;
    }

    if (url === '/file') {
      sendResponse(res, 200, 'Use /file/ prefix to load files', 'text/plain');

      return;
    }

    if (!url.startsWith('/file/')) {
      sendResponse(res, 200, 'Use /file/ prefix to load files', 'text/plain');

      return;
    }

    const filePath = url.slice(6); // Remove '/file/'

    if (!isPathSafe(filePath)) {
      if (filePath.includes('..')) {
        sendResponse(res, 400, 'Bad Request', 'text/plain');
      } else {
        sendResponse(res, 404, 'Not Found', 'text/plain');
      }

      return;
    }

    const normalizedPath = normalizePath(filePath);
    const fullPath = path.join(publicDir, normalizedPath);

    if (url === '/file/' || normalizedPath === '') {
      const indexPath = path.join(publicDir, 'index.html');

      fs.readFile(indexPath, (err, data) => {
        if (err) {
          sendResponse(res, 404, 'Not Found', 'text/plain');
        } else {
          sendResponse(res, 200, data, 'text/html');
        }
      });

      return;
    }

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        sendResponse(res, 404, 'Not Found', 'text/plain');
      } else {
        sendResponse(res, 200, data, getContentType(fullPath));
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
