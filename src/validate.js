const fs = require('fs');
const path = require('path');

const publicRoot = 'public';

const contentTypes = {
  text: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  json: 'application/json',
  txt: 'text/plain',
};

function validate(url) {
  if (url.includes('..') || url.toLowerCase().includes('%2e%2e')) {
    return {
      status: 400,
      ct: contentTypes.text,
      data: 'Bad Request',
    };
  }

  if (url.includes('//')) {
    return {
      status: 404,
      ct: contentTypes.text,
      data: 'Bad Request',
    };
  }

  const normalizedUrl = new URL(url, 'http://localhost');

  if (!normalizedUrl.pathname.startsWith('/file/')) {
    return {
      status: 200,
      ct: contentTypes.text,
      data: `Use /file/<path> to load static files. Example: /file/index.html`,
    };
  }

  const pn = normalizedUrl.pathname.split('/').filter(Boolean).slice(1);

  if (pn.length === 0) {
    return {
      status: 400,
      ct: contentTypes.html,
      data: fs.readFileSync(path.resolve(publicRoot, 'index.html')),
    };
  }

  const ptf = path.resolve(publicRoot, ...pn);

  try {
    const stat = fs.statSync(ptf);

    if (!stat.isFile()) {
      return {
        status: 400,
        ct: contentTypes.text,
        data: 'Requested path is not a file',
      };
    }

    const file = fs.readFileSync(ptf);

    const extNorm = path.extname(ptf).toLowerCase().slice(1);

    return {
      status: 200,
      ct: contentTypes[extNorm],
      data: file,
    };
  } catch (e) {
    return {
      status: 404,
      ct: contentTypes.text,
      data: 'Not Found',
    };
  }
}

module.exports = { validate };
