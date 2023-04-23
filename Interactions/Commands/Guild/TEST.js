const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const log = require('../../../Addons/Logger');
const { showExampleModal } = require('../../Modals/Example');

module.exports = {
    enabled: false,
    category: 'GUILD',
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('A test command.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction) {
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/TEST] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        try {
            // Create reply to defer the command execution.
            // const reply = await interaction.reply({ content: 'Preparing reseponse...', ephemeral: true });

            // const [channelId, messageId] = args[0].split('/').slice(-2);
            // const channel = await client.channels.fetch(channelId);
            // const message = await channel.messages.fetch(messageId);

            showExampleModal(interaction);
            // Edit the reply to indicate success.
            // await reply.edit({ content: '✅ Your response has been sent correctly.' });
        } catch (error) {
            log.bug('[/TEST] Interaction error:', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((editError) => log.bug(`[/TEST] Error editing interaction reply: ${editError}`));
        }
    },
};
