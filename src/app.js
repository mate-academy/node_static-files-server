'use strict';

const http = require('http');
const fs = require('fs');

const PORT = 4040;

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  let fileName = '';

  if (url.pathname.startsWith('/file')) {
    fileName = url.pathname.slice(5);
  } else {
    response.end('Wrong pathname. '
      + 'Correct pathname should be in the next format: </file/<pathToTheFile>'
    );
  }

  fs.readFile(`/public${fileName}`, (error, data) => {
    if (error) {
      response.statusCode = 404;
      response.end();
    } else {
      response.end(data);
    }
  }
  );

  response.end();
});

server.listen(PORT);
