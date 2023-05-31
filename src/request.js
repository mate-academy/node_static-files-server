/* eslint-disable no-console */
'use strict';

const axios = require('axios');

const BASE = 'http://localhost:3000';
const pathName = '/file/';

const href = BASE + pathName;

console.log(href);

axios.get(href).catch(() => console.log('error'));
