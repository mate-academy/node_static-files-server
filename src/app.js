'use strict';

const fs = require('fs');
const http = require('http')

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://localhost:${PORT}`)
  if (normalizedURL.pathname.slice(1).split('/')[0] !== 'file') {
    res.writeHead(400, 'Bad Request').end('Pathname should contain /file/...')
  } else {
    const fileName = normalizedURL.pathname.slice(1).replace('file', 'public')
    const correctedFileName = fileName === 'public/' || fileName === 'public'
      ?  'public/index.html'
      : fileName
    fs.readFile(`./${correctedFileName}`, (error, data) => {
      if (error) {
        res.writeHead(404, 'Page not found').end('Page not found')
      }
      res.end(data)
    })
  }


});

// Enables the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
