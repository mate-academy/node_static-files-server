'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const TEXT_PLAIN = 'text/plain';

function sendText(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': TEXT_PLAIN });
  res.end(body);
}

function sendInvalidFilePath(res) {
  sendText(res, 400, 'Invalid file path');
}

function sendFileNotFound(res) {
  sendText(res, 404, 'File not found');
}

function readTextFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendFileNotFound(res);

      return;
    }

    sendText(res, 200, data);
  });
}

function decodePathname(requestPath) {
  try {
    return decodeURIComponent(requestPath);
  } catch (error) {
    return null;
  }
}

function createServer() {
  const publicFolderPath = path.resolve(__dirname, '../public');

  const server = http.createServer((req, res) => {
    const rawUrl = req.url || '';
    // Remove query parameters
    const requestPath = rawUrl.split('?')[0];
    // handle URL-encoded characters
    const decodedPathname = decodePathname(requestPath);

    if (!decodedPathname) {
      sendInvalidFilePath(res);

      return;
    }

    if (rawUrl.includes('..') || decodedPathname.includes('..')) {
      sendInvalidFilePath(res);

      return;
    }

    if (decodedPathname === '/file' || decodedPathname === '/file/') {
      readTextFile(res, path.resolve(publicFolderPath, 'index.html'));

      return;
    }

    if (!decodedPathname.startsWith('/file/')) {
      if (path.extname(decodedPathname)) {
        sendInvalidFilePath(res);

        return;
      }

      sendText(res, 200, 'Invalid path. To load files, use: /file/filename');

      return;
    }

    const requestedFile = decodedPathname.replace(/^\/file\//, '');
    const pathSegments = requestedFile.split('/');

    if (pathSegments.includes('..')) {
      sendInvalidFilePath(res);

      return;
    }

    if (pathSegments.some((segment) => segment.length === 0)) {
      sendFileNotFound(res);

      return;
    }

    const filePath = path.resolve(publicFolderPath, requestedFile);

    if (!filePath.startsWith(`${publicFolderPath}${path.sep}`)) {
      sendInvalidFilePath(res);

      return;
    }

    readTextFile(res, filePath);
  });

  return server;
}

module.exports = {
  createServer,
};
