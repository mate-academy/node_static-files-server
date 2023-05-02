'use strict';

const http = require('http');
const fs = require('fs/promises');
const { existsSync } = require('fs');
const myConsole = require('console');
const { getNormalizedPath } = require('./getNormalizedPath');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async(request, response) => {
  const sourcePath = getNormalizedPath(request.url, request.headers.host);

  if (!sourcePath) {
    response.statusCode = 400;
    response.end('Bad request. Pathname should start with /file/');

    return;
  }

  if (!existsSync(sourcePath)) {
    response.statusCode = 404;
    response.end('Page not found');

    return;
  }

  try {
    const data = await fs.readFile(sourcePath);

    response.statusCode = 200;
    response.end(data.toString());
  } catch (error) {
    if (error) {
      response.statusCode = 500;
      response.end('Unknown error occured');
    }
  }
});

server.listen(PORT, () => {
  myConsole.log(`Server is running on ${PORT} port`);
});

http.get(`http://localhost:${PORT}/file/styles/main.css`);
