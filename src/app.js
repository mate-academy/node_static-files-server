'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  const normalizeUrl = new URL(request.url, `http://${request.headers.host}`);
  const fileName = normalizeUrl.pathname.slice(6) || 'index.html';

  if (!normalizeUrl.pathname.startsWith('/file/')) {
    response.statusCode = 400;

    response.end(
      'Invalid pathname. To load files, use the URL path starting with /file/'
    );

    return;
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (!error) {
      response.end(data);
    }

    response.statusCode = 404;
    response.end();
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
