'use strict';

const http = require('http');

const option = {
  hostname: 'localhost',
  port: 5701,
  path: '/file/../index.html',
};

http.get(option, (res) => {
  res.setEncoding('utf8');

  // eslint-disable-next-line no-console
  res.on('data', console.log);
});
