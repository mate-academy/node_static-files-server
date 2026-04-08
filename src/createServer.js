'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const FILE_PREFIX = '/file';

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain',
  });

  response.end(message);
}

function createServer() {
  return http.createServer((request, response) => {
    const [pathname] = request.url.split('?');

    if (pathname === `${FILE_PREFIX}/`) {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');

      fs.readFile(indexPath, (error, fileContent) => {
        if (error) {
          sendText(response, 404, 'File was not found');

          return;
        }

        response.end(fileContent);
      });

      return;
    }

    if (pathname === FILE_PREFIX) {
      sendText(
        response,
        200,
        'Use /file/<path> to load files from the public folder',
      );

      return;
    }

    if (!pathname.startsWith(`${FILE_PREFIX}/`)) {
      sendText(response, 400, 'Access outside public folder is forbidden');

      return;
    }

    const relativePath =
      pathname.slice(`${FILE_PREFIX}/`.length) || 'index.html';
    const pathParts = relativePath.split('/');

    if (
      pathParts.some((part) => part === '..') ||
      relativePath.includes('\\')
    ) {
      sendText(response, 400, 'Access outside public folder is forbidden');

      return;
    }

    if (relativePath.includes('//')) {
      sendText(response, 404, 'File was not found');

      return;
    }

    const normalizedPath = path.normalize(relativePath);
    const filePath = path.join(PUBLIC_DIR, normalizedPath);

    fs.readFile(filePath, (error, fileContent) => {
      if (error) {
        sendText(response, 404, 'File was not found');

        return;
      }

      response.end(fileContent);
    });
  });
}

module.exports = {
  createServer,
};
