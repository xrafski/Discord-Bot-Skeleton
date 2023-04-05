const { Events } = require('discord.js');
const log = require('../Addons/Logger');
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        log.info(`⭐ ${process.env.BOT_NAME} is logged in and online on version: ${process.env.BOT_VERSION}`);

        // Set the client user's presence
        client.user.setPresence({ activities: [{ name: ' ', type: 'WATCHING' }], status: 'idle' });

        // Update bot's setPresence every hour
        setInterval(() => {
            let memberCount = 0;
            for (const guild of client.guilds.cache) memberCount = memberCount + guild[1].memberCount; // Count all members in guilds.

            // Set client presence status.
            client.user.setPresence({
                activities: [{
                    name: `${memberCount} users 👮‍♂️`,
                    type: 'WATCHING'
                }], status: 'online'
            });
        }, 1000 * 60 * 60);

    },
};