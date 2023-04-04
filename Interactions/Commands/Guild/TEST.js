const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const log = require('../../../Addons/Logger');
const { showExampleModal } = require('../../Modals/Example');

module.exports = {
    enabled: true,
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
            // const reply = await interaction.reply({ content: 'Generating response...', ephemeral: true });
            // ##################################################################################################################################
            // // Test with a exampleButton.
            // const row = new ActionRowBuilder()
            //     .addComponents(
            //         new ButtonBuilder()
            //             .setCustomId('exampleButton')
            //             .setLabel('Click me!')
            //             .setStyle(ButtonStyle.Primary),
            //     );

            // if (!interaction.channel) {
            //     throw new Error('Interaction channel is undefined.');
            // }

            // // Send channel message.
            // await interaction.channel.send({ content: 'Hello, world!', components: [row] });
            // ##################################################################################################################################
            // Test with a modal.

            // Show modal to the user.
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
