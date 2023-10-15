'use strict';

const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 5700;

const server = http.createServer((request, response) => {
  const normalizedUrl = new URL(request.url, `http://${request.headers.host}`);
  let path = normalizedUrl.pathname.split('/');

  if (path[0] !== 'file') {
    response.statusCode = 400;

    response.end(JSON.stringify(
      {
        error: 'Filename mast start with "/file" directory',
      }
    ));
  } else {
    if (path.length === 1) {
      path = 'index.html';
    } else {
      path = path.slice(1).join('/');
    }

    fs.readFile(`.public/${path}`, (err, data) => {
      if (err) {
        response.statusCode = 404;

        response.end(JSON.stringify(
          {
            error: 'Error while reading a file',
          }
        ));
      } else {
        response.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server started! 🚀');
});
