'use strict';
// - You can find a files to test this task in ./public folder.
// |-- Its already tested with .html\.txt\.css files.
// |-- Try link like this: http://localhost:/file/index.html =)

const PORT = process.env.PORT || 8000;

const http = require('http');
const fs = require('fs');
const path = require('path');

// Server init:
const server = http.createServer((request, response) => {
  // Get file name from url params:
  const fileFromParam = request.url.split('/').slice(1);

  // Hint if the pathname does not start with /file/:
  if (fileFromParam[0] !== 'file') {
    response.end(`
      Please, use address like /file/*filename* to get the file.
    `);

    return;
  }

  // Get absolute path to file using 'path' module:
  const filePath = path
    .join(__dirname, '/public/' + fileFromParam.slice(1).join('/'));

  // Set response type to text:
  response.setHeader('Content-Type', 'text/plain');

  try {
    // Read file and return:
    const file = fs.readFileSync(filePath, 'utf-8');

    response.end(file);
  } catch (e) {
    // Return Code: 404 if we dint find a file:
    response.end('404 Page not found!');
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on: http://localhost:' + PORT);
});
