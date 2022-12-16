'use strict';

const http = require('http');
const fs = require('fs');

const { routes } = require('./routes');

const PORT = 3000;

const server = http.createServer((req, resp) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const keyWord = 'file';
  const pathArr = normalizedURL.pathname.slice(1).split('/');

  if (pathArr[0] === keyWord) {
    switch (normalizedURL.pathname) {
      case routes.INDEX_PAGE_1:
      case routes.INDEX_PAGE_2:
      case routes.INDEX_PAGE_3:
        fs.readFile('./public/index.html', (error, data) => {
          if (!error) {
            resp.statusCode = 200;
            resp.end(data);

            return;
          }

          resp.statusCode = 500;
          resp.end('Ooops, some wrong in server side');
        });
        break;
      case routes.STYLES:
        fs.readFile('./public/styles/main.css', (error, data) => {
          if (!error) {
            resp.statusCode = 200;
            resp.end(data);

            return;
          }

          resp.statusCode = 500;
          resp.end('Ooops, some wrong in server side');
        });
        break;

      default:
        resp.statusCode = 404;

        resp.end(
          // eslint-disable-next-line max-len
          `There is no file with "${pathArr[pathArr.length - 1]}" name. Try again.`
        );
        break;
    }
  } else {
    resp.end('Min request must looks like => http://localhost:3000/file');
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is starting on http://localhost:${PORT}`);
});
