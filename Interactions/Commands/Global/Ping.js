const { SlashCommandBuilder } = require('@discordjs/builders');
const log = require('../../../Addons/Logger');
const path = require('path');
const { GuildNames } = require('../../../Addons/GuildNames');
const { EmojiEnums } = require('../../../Addons/Enums');
const { InteractionError } = require('../../../Addons/Classes');

// Constants
const PING_THRESHOLD = [130, 250];
const STATUS_EMOJIS = ['✨', '🆗', '❗'];

// Get file name.
const fileName = path.basename(__filename).slice(0, -3).toLowerCase();

module.exports = {
	enabled: false,
	guild: GuildNames.GLOBAL,
	data: new SlashCommandBuilder()
		.setName(fileName)
		.setDescription('Returns websocket connection ping.')
		.setDMPermission(false),

	async execute(interaction) {
		try {
			// Destructuring assignment
			const { user, guild } = interaction;

			// Log who used the command
			log.info(`[/${fileName}] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

			// Send a reply to the user.
			const reply = await interaction.reply({ content: `${EmojiEnums.LOADING} Checking ping...`, ephemeral: true });

			// Fake 2s delay to appear as if the bot is doing something 😂
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Get websocket ping value.
			const ping = Math.round(interaction.client.ws.ping);

			// Find the appropriate status based on the ping.
			const statusIndex = PING_THRESHOLD.findIndex((threshold) => ping < threshold);

			// if the ping is less than the first threshold, return the first status emoji
			// if the ping is greater than or equal to the last threshold, return the last status emoji
			// otherwise, return the status emoji corresponding to the current threshold
			const status = statusIndex === 0 ? STATUS_EMOJIS[0] : statusIndex === -1 ? STATUS_EMOJIS[STATUS_EMOJIS.length - 1] : STATUS_EMOJIS[statusIndex];

			// Example: if ping is below 130, statusIndex will be 0, and status will be '✨'
			// Example: if ping is above 130 and below 250, statusIndex will be 1, and status will be '🆗'
			// Example: if ping is 250 and above, statusIndex will be -1, and status will be '❗'

			// Send a reply with the appropriate status.
			await reply.edit({
				content: `> ${status} Websocket latency is **${ping}** ms.`,
			});

		} catch (error) {
			new InteractionError(interaction, fileName).issue(error);
		}
	}
};