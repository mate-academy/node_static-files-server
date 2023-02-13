'use strict';

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const pathname = '/file/styles/main.css';

const href = BASE_URL + pathname;

axios.get(href);
