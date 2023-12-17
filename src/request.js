'use strict';
/* eslint-disable */
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const href = BASE_URL + '/file/styles/main.css';

axios.get(href)
  .then(res => console.log(res.data))
  .catch(err => console.log(err));
