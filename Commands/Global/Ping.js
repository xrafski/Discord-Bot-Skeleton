const { SlashCommandBuilder } = require('@discordjs/builders');
const log = require('../../Addons/logger');

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

			// Fake 2s delay to think the bot is doing something 😂
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Get websocket ping value.
			const ping = Math.round(client.ws.ping);

			// Assing emoji to an array.
			const statusArr = ['👌', '🆗', '⚠'];

			// Matches for any ping where the expression === 'true':
			switch (true) {

				// Ping below 130
				case ping < 130:
					return interactionResponse(statusArr[0], reply);

				// Ping below 250
				case ping < 250:
					return interactionResponse(statusArr[1], reply);

				// Ping above 250
				default: return interactionResponse(statusArr[2], reply);
			}

		} catch (error) {
			log.bug(`[/PING] Command error: ${error}`);
			interaction.editReply({ content: `🥶 Something went wrong with the command.\n> ${error?.message}`, ephemeral: true })
				.catch((editError) => log.bug(`[/PING] Error editing interaction reply: ${editError}`));
		}


		/**
		 * Function to send a interaction reply response.
		 * @param {String} status From the array of status.
		 * @returns Interaction reply message with correct emoji.
		 */
		async function interactionResponse(status, reply) {
			return reply.edit({ content: `> ${status} Websocket latency is **${Math.round(client.ws.ping)}** ms.`, })
				.catch((editError) => log.bug(`[/PING] Error editing interaction reply: ${editError}`));
		}
	}
};
