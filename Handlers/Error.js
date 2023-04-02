const log = require('../Addons/Logger');
/**
 * Error handler.
 * @returns Promise that resolves when the error handler is loaded.
 */
const errorHandler = () =>
    new Promise(resolve => {
        log.debug('[ERROR HANDLER] Started loading error handler.');

        // Catch all unhandled rejection messages
        process.on('unhandledRejection', err => {
            const errorLocation = err.stack.split('\n')[1].split('/').slice(-1)[0].trim();
            log.warn(`[App uncaughtException at ${errorLocation}]\n` + err.stack);
        });

        process.on('uncaughtException', err => {
            const errorLocation = err.stack.split('\n')[1].split('/').slice(-1)[0].trim();
            log.bug(`[App uncaughtException at ${errorLocation}]\n` + err.stack);
        });

        // Handle user exit the application.
        process.on('SIGINT', () => {
            process.exit(0);
        });

        process.on('exit', code => {
            log.warn('[App EXIT] About to exit with code ' + code);
        });

        log.debug('[ERROR HANDLER] Finished resolving application error handler.');
        resolve('[ERROR HANDLER] ✅ Successfully loaded application error handler.');
    });

module.exports = { errorHandler };