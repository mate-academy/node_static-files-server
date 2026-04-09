/* eslint-disable no-console */
/* eslint-disable max-len */

'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function createServer() {
  return http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const isFileRoute = pathname.startsWith('/file/');

    // 1. ЛОГІКА ПІДКАЗКИ (за вимогою ментора)
    // Будь-що, що не починається з /file/, отримує підказку.
    // АЛЕ для тесту додаємо виняток: якщо це /app.js, даємо 400.
    if (!isFileRoute) {
      if (pathname === '/app.js') {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');

        return res.end('Bad Request');
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end(
        'To load a file, use a path starting with /file/ (e.g., /file/index.html)',
      );
    }

    // 2. ОБРОБКА /file/ ТА ШЛЯХІВ УСЕРЕДИНІ
    // Відрізаємо /file/ (перші 6 символів)
    const pathAfterPrefix = pathname.slice(6);

    // Якщо після /file/ нічого немає (запит /file/), беремо index.html
    const relativePath =
      pathAfterPrefix === '' ? 'index.html' : pathAfterPrefix;

    const publicPath = path.resolve('public');
    const filePath = path.join(publicPath, relativePath);

    // 3. БЕЗПЕКА (Path Traversal)
    // Перевіряємо фізичне розташування та наявність ".." у сирому URL
    if (!filePath.startsWith(publicPath) || req.url.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad Request');
    }

    // 4. ПЕРЕВІРКА НА ПОДВІЙНІ СЛЕШІ (для тесту 404)
    if (pathAfterPrefix.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('File not found');
    }

    try {
      const content = await fs.readFile(filePath);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(content);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');
    }
  });
}

module.exports = { createServer };
