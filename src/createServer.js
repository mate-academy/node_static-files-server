const http = require('http');
const path = require('path');
const fs = require('fs/promises');

function sendMessage(res, status, message) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(message);
}

function createServer() {
  const publicDir = path.resolve(__dirname, '../public');

  const server = http.createServer(async (req, res) => {
    const rawUrl = req.url || '';

    // безпечне декодування (щоб зловити %2e%2e)
    let decodedRaw;

    try {
      decodedRaw = decodeURIComponent(rawUrl);
    } catch (e) {
      decodedRaw = rawUrl;
    }

    // явні або закодовані варіанти traversal
    const hasDotDotRaw = rawUrl.includes('..') || decodedRaw.includes('../');
    const hasEncodedDotDot = /%2e%2e/i.test(rawUrl);

    if (hasDotDotRaw || hasEncodedDotDot) {
      return sendMessage(res, 400, 'Bad Request');
    }

    // pathname (нормалізований)
    let pathname;

    try {
      pathname = new URL(rawUrl, `http://${req.headers.host}`).pathname;
    } catch (e) {
      pathname = rawUrl;
    }

    // дубльовані слеші
    if (rawUrl.includes('//') || pathname.includes('//')) {
      return sendMessage(res, 404, 'Not found');
    }

    // hint для /file (робимо по pathname)

    if (pathname === '/file' || pathname.endsWith('/file/')) {
      return sendMessage(res, 200, 'Incorrect path, use /file/<fileName>');
    }

    if (!pathname.startsWith('/file/')) {
      return sendMessage(res, 400, 'Bad request');
    }

    // відкидаємо префікс /file/ без ведучого слеша
    const relative = pathname.replace(/^\/file\//, '') || 'index.html';

    // будуємо і нормалізуємо шлях
    const filePath = path.join(publicDir, relative);
    const resolved = path.resolve(filePath);

    // перевірка, що resolved всередині publicDir
    const publicDirWithSep = publicDir.endsWith(path.sep)
      ? publicDir
      : publicDir + path.sep;

    if (!(resolved === publicDir || resolved.startsWith(publicDirWithSep))) {
      return sendMessage(res, 400, 'Bad Request');
    }

    try {
      const file = await fs.readFile(resolved);

      if (resolved.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (resolved.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }

      res.statusCode = 200;
      res.end(file);
    } catch (err) {
      return sendMessage(res, 404, 'File not found');
    }
  });

  return server;
}

module.exports = { createServer };
