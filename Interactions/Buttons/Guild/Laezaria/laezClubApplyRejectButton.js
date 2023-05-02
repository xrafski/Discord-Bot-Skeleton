const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { showLaezClubApplyRejectReasonModal } = require('../../../Modals/Guild/Laezaria/laezClubApplyRejectReasonModal');

// Button builder for laezaria's reject button.
const laezClubApplyRejectButtonBuilder = new ButtonBuilder()
    .setCustomId('laezClubApplyRejectButton')
    .setLabel('Reject')
    .setStyle(ButtonStyle.Danger);

/**
 * Sends a new message with a "Laezaria Club Apply" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addlaezClubApplyRejectButton(interaction) {

    try {
        // Make a button using the discord builder module.
        const row = new ActionRowBuilder()
            .addComponents(
                laezClubApplyRejectButtonBuilder
            );

        // Send a message with the button component.
        await interaction.channel.send({ content: '', components: [row] });

    } catch (error) { // Catch any potential errors.
        log.bug('[laezClubApplyRejectButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug('[laezClubApplyRejectButton] Error sending interaction reply:', editError));
    }
}

module.exports = {
    enabled: true,
    name: 'laezClubApplyRejectButton',
    laezClubApplyRejectButtonBuilder,
    addlaezClubApplyRejectButton,
    async execute(interaction) { // Logic when user interact with this button.

        try {
            // Log who executed this interaction.
            log.info(`[laezClubApplyRejectButton] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Display modal to the interaction.user interface.
            showLaezClubApplyRejectReasonModal(interaction); // Entire logic to reject application is under this reason modal.

        } catch (error) {
            log.bug('[laezClubApplyRejectButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.reply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((responseError) => log.bug('[laezClubApplyRejectButton] Error editing interaction reply:', responseError));
        }
    }
};
