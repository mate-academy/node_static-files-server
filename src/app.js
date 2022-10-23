'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const nameFile = req.url.match(/(?<=(\/file\/))(\w+(.\w+)+)/);

  if (nameFile) {
    fs.readFile(`./public/${nameFile[0]}`, 'utf8', (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.statusText = 'OK';
        res.end(data);
      } else {
        res.statusCode = 404;
        res.statusText = 'Bad request';
        res.end('File does not exist');
      }
    });
  }
});

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server started! 🚀');
});
