const ifunny = require('ifunny');
const config = require('./config.json')
const disk = require('./disk')

const robot = new ifunny.Client()

module.exports = { robot }
