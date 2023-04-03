/* eslint-disable no-empty-function */
/* eslint-disable no-console */
const moment = require('moment');
const format = 'DD/MM/YYYY - hh:mm:ss A [UTC]';

const log = {
    log: function (message) { console.log(`[${moment().utc().format(format)}] [LOG]`, message); },
    info: function (message) { console.info(`[${moment().utc().format(format)}] [INFO]`, message); },
    debug: process.env.BOT_DEBUG === 'true' ? function (message) { console.debug(`[${moment().utc().format(format)}] ⭕ [DEBUG]`, message); } : () => { },
    warn: function (message, error) { console.warn(`[${moment().utc().format(format)}] [WARN]`, message, error); },
    bug: function (message, error) { console.error(`[${moment().utc().format(format)}] [🐛 BUG]`, message, error); },
};

module.exports = log;