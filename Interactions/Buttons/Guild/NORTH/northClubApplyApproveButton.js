const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');

// Variables
// const northMemberRoleID = '288385193285386248';
// const approveIcon = '';

// Button builder for THE NORTH's approve button.
const northClubApplyApproveButtonBuilder = new ButtonBuilder()
    .setCustomId('northClubApplyApproveButton')
    .setLabel('Approve')
    .setStyle(ButtonStyle.Success);

/**
 * Sends a new message with a "THE NORTH Club Apply" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addNorthClubApplyApproveButton(interaction) {

    try {
        // Make a button using the discord builder module.
        const row = new ActionRowBuilder()
            .addComponents(
                northClubApplyApproveButtonBuilder
            );

        // Send a message with the button component.
        await interaction.channel.send({ components: [row] });

    } catch (error) {
        log.bug('[northClubApplyApproveButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug('[northClubApplyApproveButton] Error sending interaction reply:', editError));
    }
}

module.exports = {
    enabled: true,
    name: 'northClubApplyApproveButton',
    northClubApplyApproveButtonBuilder,
    addNorthClubApplyApproveButton,
    async execute(interaction) {// Logic when user interact with this button

        try {
            // Log who used this interaction.
            log.info(`[northClubApplyApproveButton] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Create reply to defer the button execution.
            const reply = await interaction.reply({ content: `${findEmoji(interaction.client, emojiList.loading)} Preparing response...`, ephemeral: true });
            reply.edit({ content: 'This button is missing additional logic!' });

        } catch (error) { // Catch any potential errors.
            log.bug('[northClubApplyApproveButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
            }).catch((responseError) => log.bug('[northClubApplyApproveButton] Error editing interaction reply:', responseError));
        }

    }
};