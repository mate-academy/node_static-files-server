'use strict';

const fs = require('fs');
const http = require('http');
const url = require('url');

(async() => {
  const server = http.createServer((req, res) => {
    const normUrl = new url.URL(req.url, `http://${req.headers.host}`);

    if (req.url.includes('/file/')) {
      const location = normUrl.pathname.replace('/file/', 'public/');

      if (fs.existsSync(location)) {
        fs.readFile(location, (err, data) => {
          if (!err) {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            res.end(data);
          } else {
            res.statusCode = 500;
            res.end(err);
          }
        });
      } else {
        res.statusCode = 404;
        res.end('No such file');
      }
    } else {
      res.end(
        `To load files use the following URL pattern:
        [server]/file/[file path]/[file name]`
      );
    }
  });

  server.listen(5700, () => {
    // eslint-disable-next-line no-console
    console.log('Server started! 🚀');
  });
})();
