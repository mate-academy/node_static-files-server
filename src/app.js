/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);

  if (normalizedURL.pathname.startsWith('/file/')) {
    const fileName = normalizedURL.pathname
      .replace('/file/', '') || 'index.html';

    fs.readFile('./public/' + fileName, (error, data) => {
      if (!error) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  } else {
    res.end(`<div style="
              color: green;
              text-align: center;
              font-size: 36px;
              font-weight: 200"
            >
              If you want to download a file in the address bar, enter:
              <span style="color: blue; font-weight: 800" >
                /file/ or /file/index.html
              <span>
            </div>`);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
