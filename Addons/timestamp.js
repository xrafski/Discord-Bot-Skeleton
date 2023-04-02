/* eslint-disable no-console */

const moment = require('moment');
const format = 'DD/MM/YYYY - hh:mm:ss A z';

if (!process.env.BOT_DEBUG) {
    require('log-timestamp')(function () { return moment(Date.now()).utc().format(format); });
}

const log = console.log.bind(console, '[LOG]');
const info = console.log.bind(console, '[INFO]');
const debug = console.warn.bind(console, '[DEBUG]');
const warn = console.warn.bind(console, '[WARN]');
const bug = console.error.bind(console, '[ERROR]');


module.exports = {
    log,
    info,
    debug,
    warn,
    bug
};