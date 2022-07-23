const path = require('path')
const fs = require('fs')

fs.copyFileSync(path.join(__dirname, '../public/emnapi.svg'), path.join(__dirname, '../.vitepress/dist/emnapi.svg'))
