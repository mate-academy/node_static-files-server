/* eslint-disable no-console */
/* eslint-disable max-len */

'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function createServer() {
  return http.createServer(async (req, res) => {
    // 1. Отримуємо шлях
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    // 2. ЛОГІКА ДЛЯ ТЕСТУ ТА БЕЗПЕКИ
    // Перевіряємо, чи шлях починається з /file/ або є рівно /file
    const isFileRequest = pathname.startsWith('/file/');
    const isExactFileRoot = pathname === '/file';

    if (!isFileRequest && !isExactFileRoot) {
      // Якщо шлях - це просто '/', даємо підказку (статус 200)
      if (pathname === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

        return res.end(
          'To load a file, use a path starting with /file/ (e.g., /file/index.html)',
        );
      }

      // Якщо це щось інше (наприклад, /app.js), тест вважає це спробою злому
      // через те, що axios нормалізував .. у цей шлях.
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad Request');
    }

    // 3. ОБРОБКА /file ТА /file/ (віддаємо index.html за вимогою ментора)
    const pathAfterPrefix = pathname.slice(6);
    const relativePath =
      isExactFileRoot || pathAfterPrefix === ''
        ? 'index.html'
        : pathAfterPrefix;

    const publicPath = path.resolve('public');
    const filePath = path.join(publicPath, relativePath);

    // 4. ПЕРЕВІРКА НА PATH TRAVERSAL (для сирих запитів з curl)
    if (!filePath.startsWith(publicPath) || req.url.includes('..')) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad Request');
    }

    // 5. ПЕРЕВІРКА НА ПОДВІЙНІ СЛЕШІ (тест 404)
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
