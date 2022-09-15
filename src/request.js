/* eslint-disable no-console */
'use strict';

const http = require('http');
const readline = require('readline');
const PORT = process.env.PORT || 3000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = () => {
  rl.question('Enter pathname: ', pathname => {
    http.get(`http://localhost:${PORT}${pathname}`, (res) => {
      res.setEncoding('utf8');

      rl.write('\n');

      res.on('data', data => {
        console.log(data);
      });

      res.on('error', () => {
        console.log('Error');
      });

      res.on('close', () => {
        console.log(`${res.statusCode}: ${res.statusMessage}\n`);

        question();
      });
    });
  });
};

question();
