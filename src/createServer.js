'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const PREFIX = '/file';

/**
 * Creates an HTTP server to serve static files from the 'public' folder.
 * @returns {http.Server} The configured HTTP server.
 */
function createServer() {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname.includes('//')) {
      res.writeHead(404, 'Not Found', { 'Content-Type': 'text/plain' });

      res.end(
        `Please, use next format: http://${req.headers.host}${PREFIX}/<path_to_your_file>`,
      );

      return;
    }

    // Перевіряємо, чи шлях не починається з /file/ і не є /file
    if (!pathname.startsWith(`${PREFIX}/`) && pathname !== PREFIX) {
      res.writeHead(400, 'Bad request', { 'Content-Type': 'text/plain' });

      res.end(
        `Please, use next format: http://${req.headers.host}${PREFIX}/<path_to_your_file>`,
      );

      return;
    }

    // Обробляємо /file як підказку зі статусом 200
    if (pathname === PREFIX) {
      res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });

      res.end(
        `Please, use next format: http://${req.headers.host}${PREFIX}/<path_to_your_file>`,
      );

      return;
    }

    const fileName = path.join(
      'public',
      pathname === `${PREFIX}/` ? 'index.html' : pathname.replace(PREFIX, ''),
    );

    // Перевіряємо, чи нормалізований шлях залишається в межах public
    const publicDir = path.join(__dirname, '..', 'public');
    const resolvedPath = path.resolve(fileName);

    if (!resolvedPath.startsWith(path.resolve(publicDir))) {
      res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
      res.end('Traversal paths are not allowed');

      return;
    }

    // Перевіряємо, чи файл існує
    if (!fs.existsSync(fileName)) {
      res.writeHead(404, 'Not Found', { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found`);

      return;
    }

    fs.readFile(fileName, (err, data) => {
      if (err) {
        res.writeHead(404, 'Not Found', { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found`);

        return;
      }

      // Динамічне визначення Content-Type на основі розширення
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'application/octet-stream'; // За замовчуванням

      if (ext === '.html') {
        contentType = 'text/html';
      } else if (ext === '.css') {
        contentType = 'text/css';
      } else if (ext === '.js') {
        contentType = 'application/javascript';
      }
      res.writeHead(200, 'OK', { 'Content-Type': contentType });

      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
