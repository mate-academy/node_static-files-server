/* eslint-disable no-console */
'use strict';

const axios = require('axios');

const BASE_URL = 'http://localhost:8000';
const pathname = '/file/index.html';

const href = BASE_URL + pathname;

axios.get(href)
  .then((data) => console.log(data.data))
  .catch((e) => console.log(e));
