const fs = require('fs');
const { resolve } = require('path');
fs.mkdirSync(resolve('./bin'), { recursive: true });
