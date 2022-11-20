'use strict';

const axios = require('axios');

const BASE = 'http://localhost:8080';

const pathname = '/file/index.html';

const href = BASE + pathname;

// eslint-disable-next-line no-console
console.log(href);

axios.get(href)
// eslint-disable-next-line no-console
  .catch(() => console.log('Error'));
