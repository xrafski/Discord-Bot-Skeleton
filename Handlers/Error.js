const { warn, debug, bug } = require('../Addons/timestamp');

/**
 * Error handler.
 * @returns Promise that resolves when the error handler is loaded.
 */
const errorHandler = () =>
    new Promise(resolve => {
        process.env.BOT_DEBUG && debug('[ERROR HANDLER] Started loading error handler.');

        // Catch all unhandled rejection messages
        process.on('unhandledRejection', err => {
            const errorLocation = err.stack.split('\n')[1].split('/').slice(-1)[0].trim();
            warn(`[App uncaughtException at ${errorLocation}]\n` + err.stack);
        });

        process.on('uncaughtException', err => {
            const errorLocation = err.stack.split('\n')[1].split('/').slice(-1)[0].trim();
            bug(`[App uncaughtException at ${errorLocation}]\n` + err.stack);
        });

        // Handle user exit the application.
        process.on('SIGINT', () => {
            process.exit(0);
        });

        process.on('exit', code => {
            warn('[App EXIT] About to exit with code ' + code);
        });

        process.env.BOT_DEBUG && debug('[ERROR HANDLER] Finished resolving application error handler.');
        resolve('[ERROR HANDLER] ✅ Successfully loaded application error handler.');
    });

module.exports = { errorHandler };