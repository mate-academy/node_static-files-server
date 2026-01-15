const fs = require('fs');
const path = require('path');

const contentTypes = {
  html: 'text/html',
  css: 'text/css',
  json: 'application/json',
  txt: 'text/plain',
};

function validate(url) {
  if (url.includes('..') || url.toLowerCase().includes('%2e%2e')) {
    return {
      status: 400,
      data: 'Bad Request',
    };
  }

  if (url.includes('//')) {
    return {
      status: 404,
      data: 'Bad Request',
    };
  }

  const normalizedUrl = new URL(url, 'http://localhost');

  if (
    !normalizedUrl.pathname.startsWith('/file/') &&
    /\.[a-z0-9]+$/i.test(normalizedUrl.pathname)
  ) {
    return {
      status: 400,
      data: 'Bad Request',
    };
  }

  if (!normalizedUrl.pathname.startsWith('/file/')) {
    return {
      status: 200,
      data: `Use /file/<path> to load static files. Example: /file/index.html`,
    };
  }

  let filePath = normalizedUrl.pathname.slice('/file/'.length);

  if (!filePath) {
    filePath = 'index.html';
  }

  const ptf = path.join(__dirname, '../public', filePath);
  const publicDir = path.resolve(__dirname, '../public');

  if (!ptf.startsWith(publicDir)) {
    return {
      status: 400,
      data: `Acess denied`,
    };
  }

  try {
    const data = fs.readFileSync(ptf);
    const ext = path.extname(ptf).slice(1).toLowerCase();

    return {
      status: 200,
      ct: contentTypes[ext],
      data,
    };
  } catch {
    return { status: 404, data: 'Not Found' };
  }
}

module.exports = { validate };
