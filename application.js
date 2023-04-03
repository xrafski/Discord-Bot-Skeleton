require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const log = require('./Addons/Logger');
const { loadAppCmds, guildCmds, registerGuildCmds, registerGlobalCmds, globalCmds } = require('./Handlers/Commands');
const { loadAppButtons } = require('./Handlers/Buttons');
const { errorHandler } = require('./Handlers/Errors');
const { eventHandler } = require('./Handlers/Events');

// Create a new client instance
const client = new Client({
    intents: [
        // GatewayIntentBits.DirectMessageReactions,
        // GatewayIntentBits.DirectMessageTyping,
        // GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.GuildBans,
        // GatewayIntentBits.GuildEmojisAndStickers,
        // GatewayIntentBits.GuildIntegrations,
        // GatewayIntentBits.GuildInvites,
        // GatewayIntentBits.GuildMembers,
        // GatewayIntentBits.GuildMessageReactions,
        // GatewayIntentBits.GuildMessageTyping,
        // GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.GuildPresences,
        // GatewayIntentBits.GuildScheduledEvents,
        // GatewayIntentBits.GuildVoiceStates,
        // GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        // GatewayIntentBits.MessageContent,
    ],
    allowedMentions: { parse: ['roles', 'users'], repliedUser: false }
});
log.info('Application initialization started...');

async function start() {
    try {
        const [errorResult, eventsTable, commandsTable, buttonTable] = await Promise.all([
            errorHandler(),
            eventHandler(client),
            loadAppCmds(client),
            loadAppButtons(client)
        ]);

        log.info(errorResult);
        // eslint-disable-next-line no-console
        console.log(eventsTable);
        // eslint-disable-next-line no-console
        console.log(commandsTable);
        // eslint-disable-next-line no-console
        console.log(buttonTable);

        // Register global interaction commands and then register guild interaction commands.
        await registerGlobalCmds(globalCmds)
            .then(res => {
                log.info(res);
                return registerGuildCmds(guildCmds);
            })
            .then(res => {
                log.info(res);
                return client.login(process.env.DISCORD_TOKEN);
            })
            .catch(err => log.bug('[STARTUP] Error to register commands or login to Discord', err));

        log.info('📣 Application started successfully!');
    } catch (err) {
        log.bug('[STARTUP] Error to start up the bot.', err);
        process.exit(1);
    }
}

start();