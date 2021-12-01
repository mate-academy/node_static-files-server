import http from 'http';
import fs from 'fs';
import url from 'url';

const PORT = process.env.port || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
  console.log("normalized url: " + normalizedURL);

  if (!String(normalizedURL).includes('file')) {
    throw new Error("Pathname should start with `/file/`");
  }

  const fileName = normalizedURL.pathname.slice(1).replace('file', 'public');
  console.log("filename: " + fileName);

  fs.readFile(fileName, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}...`);
})
