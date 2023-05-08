const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const log = require('../../../Addons/Logger');
const path = require('path');
const { GuildNames } = require('../../../Addons/GuildNames');
const { EmojiEnums } = require('../../../Addons/Enums');
const { InteractionError } = require('../../../Addons/Classes');

// Get file name.
const fileName = path.basename(__filename).slice(0, -3).toLowerCase();

module.exports = {
    enabled: false,
    guild: GuildNames.TEA,
    data: new SlashCommandBuilder()
        .setName(fileName)
        .setDescription('Template command')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            // Destructuring assignment.
            const { user, guild } = interaction;

            // Log who used the command.
            log.info(`[/${fileName}] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);


            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: `${EmojiEnums.LOADING} Preparing reseponse...`, ephemeral: true });

            // SOME CODE FOR THE COMMAND.

            // Edit the reply to indicate success.
            await reply.edit({ content: '✅ Your response is handled correctly.' });

        } catch (error) {
            new InteractionError(interaction, fileName).issue(error);
        }
    },
};
