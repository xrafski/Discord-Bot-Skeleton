require('dotenv').config();
const { loadAppCmds, guildCmds, registerGuildCmds, registerGlobalCmds, globalCmds } = require('./Handlers/Commands');
const { bug, info } = require('./Addons/timestamp');
const { Client, GatewayIntentBits } = require('discord.js');
const { errorHandler } = require('./Handlers/Error');
const { eventHandler } = require('./Handlers/Event');


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

info('Application initialization started...');
Promise.all([errorHandler(), eventHandler(client), loadAppCmds(client)])
    .then(async results => {
        info(results[0]); // Results from errorHandler().
        // eslint-disable-next-line no-console
        console.log(results[1]); // Table with loaded events from eventHandler().
        // eslint-disable-next-line no-console
        console.log(results[2]); // Table with loaded application interactions from loadAppCmds().

        // Register global interaction commands.
        await registerGlobalCmds(globalCmds)
            .then(res => info(res))
            .catch(err => bug('Error to register global interaction commands', err));

        // Register guild interaction commands.
        await registerGuildCmds(guildCmds)
            .then(res => info(res))
            .catch(err => bug('Error to register guild interaction commands', err));

        // Login to Discord with your client's token when all promises are resolved.
        await client.login(process.env.DISCORD_TOKEN)
            .catch(err => bug('[STARTUP] Application login error', err));
    })
    .catch(err => bug('[STARTUP] Error to start up the bot.', err));