/* eslint-disable no-console */
import http from 'http';

const href = 'http://localhost:8080/file/index.html';

http.get(href, res => {
  res.setEncoding('utf8');

  res.on('data', (data) => {
    console.log(data);
  });

  res.on('error', (error) => {
    console.log(error);
  });
});
