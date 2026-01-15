'use strict';

const http = require('http');
const v = require('./validate');

function createServer() {
  return http.createServer((req, res) => {
    const validated = v.validate(req.url);

    res.statusCode = validated.status;
    res.setHeader('Content-Type', validated.ct);
    res.end(validated.data);
  });
}

module.exports = {
  createServer,
};
