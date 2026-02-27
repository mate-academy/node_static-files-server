/* eslint-disable no-console */
/* eslint-disable max-len */
'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function createServer() {
  return http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    // 1. ВИЗНАЧАЄМО, ЧИ ЦЕ ЗАПИТ НА ФАЙЛ (починається з /file/)
    const isFileRequest = pathname.startsWith('/file/');

    // 2. ВИЗНАЧАЄМО, ЧИ ЦЕ ЗАПИТ НА ПІДКАЗКУ (/file або /)
    const isHintRequest = pathname === '/file' || pathname === '/';

    // 3. ЯКЩО ЦЕ НІ ТЕ, НІ ІНШЕ (наприклад, /app.js), ТО ЦЕ 400
    if (!isFileRequest && !isHintRequest) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad Request');
    }

    // 4. ПЕРЕВІРКА НА ПІДКАЗКУ (статус 200)
    if (isHintRequest) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end(
        'To load a file, use a path starting with /file/ (e.g., /file/index.html)',
      );
    }

    // 5. ПЕРЕВІРКА НА ПОДВІЙНІ СЛЕШІ ВСЕРЕДИНІ ШЛЯХУ (після /file/)
    const pathAfterPrefix = pathname.slice(6);

    if (pathAfterPrefix.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('File not found');
    }

    // 6. РОБОТА З ФАЙЛАМИ
    const relativePath = pathAfterPrefix || 'index.html';
    const publicPath = path.resolve('public');
    const filePath = path.join(publicPath, relativePath);

    try {
      const content = await fs.readFile(filePath);

      res.statusCode = 200;
      res.end(content);
    } catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');
    }
  });
}

module.exports = { createServer };
