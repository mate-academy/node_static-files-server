'use strict';

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

function badRequest(res) {
  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.end('Bad Request');
}

function hint(res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hint: /file/*filename*');
}

module.exports = {
  notFound,
  badRequest,
  hint,
};
