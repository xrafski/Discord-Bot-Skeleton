const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { showNorthClubApplyRejectReasonModal } = require('../../../Modals/Guild/NORTH/northClubApplyRejectReasonModal');

// Variables
const grandCounsilRoleID = '1104437369559601244';
const devRoleID = '1104437516154712064';
const adminRoleID = '1104437669951438879';

// Button builder for THE NORTH's reject button.
const northClubApplyRejectButtonBuilder = new ButtonBuilder()
    .setCustomId('northClubApplyRejectButton')
    .setLabel('Reject')
    .setStyle(ButtonStyle.Danger);

/**
 * Sends a new message with a "THE NORTH Club Apply" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addnorthClubApplyRejectButton(interaction) {

    try {
        // Make a button using the discord builder module.
        const row = new ActionRowBuilder()
            .addComponents(
                northClubApplyRejectButtonBuilder
            );

        // Send a message with the button component.
        await interaction.channel.send({ components: [row] });

    } catch (error) { // Catch any potential errors.
        log.bug('[northClubApplyRejectButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug('[northClubApplyRejectButton] Error sending interaction reply:', editError));
    }
}

module.exports = {
    enabled: true,
    name: 'northClubApplyRejectButton',
    northClubApplyRejectButtonBuilder,
    addnorthClubApplyRejectButton,
    async execute(interaction) { // Logic when user interact with this button.

        try {
            // Log who executed this interaction.
            log.info(`[northClubApplyRejectButton] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Get the member object in that guild.
            const member = await interaction.guild.members.fetch(interaction.user.id);

            // Check if interactor has permissions to use the button.
            if (!member.roles.cache.has(grandCounsilRoleID) && !member.roles.cache.has(devRoleID) && !member.roles.cache.has(adminRoleID)) {
                return interaction.reply({ content: 'You are not authorised to perform this action!', ephemeral: true });
            }

            // Display modal to the interaction.user interface.
            showNorthClubApplyRejectReasonModal(interaction); // Entire logic to reject application is under this reason modal.

        } catch (error) {
            log.bug('[northClubApplyRejectButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.reply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((responseError) => log.bug('[northClubApplyRejectButton] Error editing interaction reply:', responseError));
        }
    }
};