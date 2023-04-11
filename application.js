require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const log = require('./Addons/Logger');
const { loadAppCmds, guildCmds, registerGuildCmds, registerGlobalCmds, globalCmds } = require('./Handlers/Commands');
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
        await registerGlobalCmds(globalCmds)
            .then(res => {
                log.info(res);
                return registerGuildCmds(guildCmds);
            })
            .then(res => {
                log.info(res);
                return client.login(process.env.DISCORD_APP_TOKEN);
            })
            .catch(err => log.bug('[STARTUP] Error to register commands or login to Discord', err));

        log.info('📣 Application started successfully!');
    } catch (err) {
        log.bug('[STARTUP] Error to start up the bot.', err);
        process.exit(1);
    }
}

start();