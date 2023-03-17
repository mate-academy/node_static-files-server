/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  const normalizedUrl = new URL(request.url, `http://localhost:${PORT}`);
  const filePath = normalizedUrl.pathname.slice(6) || 'index.html';

  if (normalizedUrl.pathname.indexOf('/file') === 0) {
    fs.readFile(`src/public/${filePath}`, (error, data) => {
      if (!error) {
        response.end(data);
      }

      response.statusCode = 404;
      response.end('File not found');
    });
  } else {
    response.statusCode = 400;

    response.end(
      'URL should be something like this: /file/{filename or path + name}'
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
