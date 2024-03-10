/* eslint-disable no-console */
"use strict";

const http = require("node:http");
const fs = require("fs");
const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

function createServer() {
  return http.createServer((req, res) => {
    const url = req.url;

    res.setHeader("Content-Type", "text/plain");

    if (url.includes("../")) {
      res.statusCode = BAD_REQUEST;
      res.end("Invalid path");

      return;
    }

    if (!url.startsWith("/file/")) {
      res.statusCode = OK;
      res.end("Hint: Routes must start with /file/");

      return;
    }

    if (url.includes("//")) {
      res.statusCode = NOT_FOUND;
      res.end("Path has duplicated slashes");

      return;
    }

    const fileName = url.replace("/file/", "") || "index.html";

    fs.readFile(`./public/${fileName}`, (error, data) => {
      if (!error) {
        res.writeHead(OK, { "Content-Type": "text/html" });
        res.end(data);
      } else {
        res.statusCode = NOT_FOUND;
        res.end("Non-existent file");
      }
    });
  });
}

module.exports = {
  createServer,
};
