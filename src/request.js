/* eslint-disable no-console */
const axios = require('axios');
const BASE = 'http://localhost:5701';

const href = BASE + '/file/../user/1/friends' + '?sex=m&age=25&age=35';

console.log(href);

axios.get(href).catch((err) => console.log(err));
