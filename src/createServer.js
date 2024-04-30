'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

function createServer() {
  const server = http.createServer((request, response) => {
    const hasDoubleSlash = /\/\//g;

    if (hasDoubleSlash.test(request.url)) {
      response.statusCode = 404;
      response.statusMessage = 'Double slashes not supported.';
      response.end('Hint: Message for routes not starting with /file/');

      return;
    }

    const normalizedUrl = new URL(
      request.url,
      `http://${request.headers.host}`,
    );
    const pathName = normalizedUrl.pathname.slice(1);

    if (fs.existsSync(path.resolve(__dirname, pathName))) {
      response.statusCode = 400;
      response.statusMessage = 'URL has traversal paths';
      response.end();

      return;
    }

    if (!normalizedUrl.pathname.startsWith('/file/')) {
      response.setHeader('Content-Type', 'text/plain');
      response.end('Hint: Pathname should start with "/file/" to load a file.');

      return;
    }

    const pathNameNoFile =
      pathName === 'file' || pathName === 'file/'
        ? 'index.html'
        : pathName.replace('file/', '');

    const filePath = path.resolve(__dirname, `../public/${pathNameNoFile}`);

    const checkFile = async () => {
      try {
        const file = await fs.promises.readFile(filePath);

        response.write(file);
        response.end();
      } catch (error) {
        response.setHeader('Content-Type', 'text/plain');
        response.statusCode = 404;
        response.end('File does not exist.');
      }
    };

    checkFile();
  });

  return server;
}

module.exports = {
  createServer,
};
