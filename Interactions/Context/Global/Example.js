const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const log = require('../../../Addons/Logger');
const path = require('path');
const { EmojiEnums, GuildEnums } = require('../../../Addons/Enums');
const { InteractionError } = require('../../../Addons/Classes');

const fileName = path.basename(__filename).slice(0, -3);

module.exports = {
    enabled: false,
    guild: GuildEnums.GLOBAL,
    data: new ContextMenuCommandBuilder()
        .setName(fileName)
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, message) {
        try {

            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: `${EmojiEnums.LOADING} Preparing reseponse...`, ephemeral: true });

            // Log with interaction arguments.
            log.debug('Arguments:', message);

            // Fake delay to appear as if the bot is doing something 😂
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Edit the reply
            await reply.edit({ content: `${fileName} response is handled correctly.` });

        } catch (error) {
            new InteractionError(interaction, fileName).issue(error);
        }
    }
};