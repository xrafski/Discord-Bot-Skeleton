const { SlashCommandBuilder } = require('@discordjs/builders');
const log = require('../../../Addons/Logger');
const path = require('path');
const { EmojiEnums, GuildEnums } = require('../../../Addons/Enums');
const { InteractionError } = require('../../../Addons/Classes');

// Get file name.
const fileName = path.basename(__filename).slice(0, -3).toLowerCase();

module.exports = {
	enabled: false,
	guild: GuildEnums.GLOBAL,
	data: new SlashCommandBuilder()
		.setName(fileName)
		.setDescription('Example global command')
		.setDMPermission(false),

	async execute(interaction, args) {
		try {
			// Destructuring assignment.
			const { user, guild } = interaction;
			log.debug('Arguments:', args);

			// Log who used the command.
			log.info(`[/${fileName}] Command executed by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

			// Create reply to defer the command execution.
			const reply = await interaction.reply({ content: `${EmojiEnums.LOADING} Preparing reseponse...`, ephemeral: true });

			// Fake delay to appear as if the bot is doing something 😂
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Edit the reply
			await reply.edit({ content: `${fileName} response is handled correctly.` });

		} catch (error) {
			new InteractionError(interaction, fileName).issue(error);
		}
	}
};