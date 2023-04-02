const { SlashCommandBuilder } = require('@discordjs/builders');
const log = require('../../Addons/Logger');

// Constants
const PING_THRESHOLD = [130, 250];
const STATUS_EMOJIS = ['✨', '🆗', '❗'];

module.exports = {
	enabled: true,
	category: 'GLOBAL',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Returns websocket connection ping.')
		.setDMPermission(false),

	async execute(client, interaction) {
		const { user, guild } = interaction;

		// Log who used the command.
		log.info(`[/PING] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

		try {
			// Send a reply to the user.
			const reply = await interaction.reply({ content: 'Checking ping...', ephemeral: true });

			// Fake 2s delay to make it appear as if the bot is doing something 😂
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Get websocket ping value.
			const ping = Math.round(client.ws.ping);

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
			await interactionResponse(status, ping, reply);

		} catch (error) {
			log.bug(`[/PING] Command error: ${error}`);

			// Send an error message to the user.
			await interaction.editReply({
				content: 'Something went wrong with the command. Please try again later.',
				ephemeral: true
			}).catch((editError) => log.bug(`[/PING] Error editing interaction reply: ${editError}`));
		}
	}
};

/**
 * Function to send an interaction reply response.
 * @param {String} status The status emoji to use.
 * @param {Number} ping The websocket ping.
 * @param {Object} reply The interaction reply object.
 * @returns {Promise<void>}
 */
async function interactionResponse(status, ping, reply) {
	await reply.edit({
		content: `> ${status} Websocket latency is **${ping}** ms.`,
	}).catch((error) => {
		log.bug(`[/PING] Error editing interaction reply: ${error}`);
	});
}
