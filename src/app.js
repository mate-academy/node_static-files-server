'use strict';

const http = require('http');
const fs = require('fs/promises');

const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, resp) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (!url.pathname.startsWith('/file')) {
    resp.statusCode = 400;
    resp.statusMessage = 'Bad request'

    resp.end('pathname should start from "/file/"');

    return
  }

  let filePath = `src/public/${url.pathname.slice(6) ||  'index.html'}`;

  const isExtensionInFileName = filePath.slice(filePath.lastIndexOf('/')).includes('.');
  
  if (!isExtensionInFileName) {
    filePath += '.html'
  }

  try {
    const page = await fs.readFile(filePath, 'utf8');

    resp.statusCode = 200;
    resp.statusMessage = 'OK';
    resp.end(page)
  } catch (error) {
    resp.statusCode = 404;
    resp.statusMessage = 'Page not foud'
    resp.end(`${url.pathname} not found!`)
  }

})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
