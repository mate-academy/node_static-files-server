"use strict";

const fs = require("fs");
const http = require("http");

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://localhost:${PORT}`);
  const path = normalizedURL.pathname.slice(1);
  if (path.split("/")[0] !== "file") {
    res.writeHead(400, "Bad Request").end("Pathname should contain /file/...");
    return;
  }

  const fileName = path.replace("file", "public");
  const correctedFileName =
    fileName === "public/" || fileName === "public"
      ? "public/index.html"
      : fileName;

  fs.readFile(`./${correctedFileName}`, (error, data) => {
    if (error) {
      res.writeHead(404, "Page not found").end("Page not found");
      return;
    }
    res.end(data);
  });
});

server.listen(PORT, () => {
  //eslint-disable-next-line
  console.log(`Server is running on http://localhost:${PORT}`);
});
