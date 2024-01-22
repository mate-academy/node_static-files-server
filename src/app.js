'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = normalizedUrl.pathname;
  const urlShouldHave = '/file/';

  if (!pathname || !pathname.startsWith(urlShouldHave)) {
    res.write('The pathname is not correct. It should start from /file/.');
    res.end('Example: /file/index.html returns public/index.html');
  } else {
    const resultString = pathname.replace(new RegExp(urlShouldHave), '');
    const fileName = resultString || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.write('sucess');
        res.end(data);
      }

      res.statusCode = 404;
      res.end();
    });
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server is running on http://localhost:${PORT}`);
});
