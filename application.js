require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const log = require('./Addons/Logger');
const { loadAppCmds, registerGuildCmds, registerGlobalCmds, appCommands } = require('./Handlers/Commands');
const { loadAppButtons } = require('./Handlers/Buttons');
const { errorHandler } = require('./Handlers/Errors');
const { eventHandler } = require('./Handlers/Events');
const loadAppModals = require('./Handlers/Modals');
const loadAppMenus = require('./Handlers/Menus');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
    allowedMentions: { parse: ['roles', 'users'], repliedUser: false }
});
log.info('Application initialization started...');

async function start() {
    try {
        const [errorResult, eventsTable, commandsTable, buttonTable, modalTable, menuTable] = await Promise.all([
            errorHandler(),
            eventHandler(client),
            loadAppCmds(client),
            loadAppButtons(client),
            loadAppModals(client),
            loadAppMenus(client)
        ]);

        log.info(errorResult); // Response from error handler being loaded.
        // eslint-disable-next-line no-console
        console.log(eventsTable); // Ascii table with event listeners loaded.
        // eslint-disable-next-line no-console
        console.log(commandsTable); // Ascii table with application commands loaded.
        // eslint-disable-next-line no-console
        console.log(buttonTable); // Ascii table with application buttons loaded.
        // eslint-disable-next-line no-console
        console.log(modalTable); // Ascii table with application modals loaded.
        // eslint-disable-next-line no-console
        console.log(menuTable); // Ascii table with application selection menus loaded.

        // Register global interaction commands and then register guild interaction commands.
        await registerGlobalCmds(appCommands.global)
            .then(async regGlobCmdsRes => {
                log.info(regGlobCmdsRes); // Log global commands registry response.

                // Register guild commands in order and then log to the bot client.
                registerGuildCommands()
                    .then(() => {
                        return client.login(process.env.DISCORD_APP_TOKEN); // Log to the bot client.
                    });

                async function registerGuildCommands() {
                    await registerGuildCmds(appCommands.backend, process.env.BACKEND_GUILD_ID, 'Backend Server').then(log.info); // Register backend guild commands and then log.info the results.
                    await registerGuildCmds(appCommands.laezaria, process.env.TEST_GUIID_ID, 'Laezaria').then(log.info); // Register laezaria guild commands and then log.info the results.
                }
            })
            .catch(err => log.bug('[STARTUP] Error to register commands or login to Discord', err));
    } catch (err) {
        log.bug('[STARTUP] Error to start up the bot.', err);
        process.exit(1);
    }
}

// Run the application.
start();