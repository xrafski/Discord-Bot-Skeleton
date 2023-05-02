const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const { GuildNames } = require('../../../Addons/GuildNames');
const log = require('../../../Addons/Logger');
const { findEmoji } = require('../../../Addons/findEmoji');

module.exports = {
    enabled: false,
    guild: GuildNames.TEA,
    data: new SlashCommandBuilder()
        .setName('template')
        .setDescription('Template command')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/TEMPLATE] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        try {
            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: `${findEmoji(interaction.client, 'loading')} Preparing reseponse...`, ephemeral: true });

            // SOME CODE FOR THE COMMAND.

            // Edit the reply to indicate success.
            await reply.edit({ content: '✅ Your response is handled correctly.' });
        } catch (error) {
            log.bug('[/TEMPLATE] Interaction error:', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((editError) => log.bug('[/TEMPLATE] Error editing interaction reply:', editError));
        }
    },
};
