const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { showNorthClubApplyModal } = require('../../../Modals/Guild/NORTH/northClubApplyModal');
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');

// Variables
const northMemberRoleID = '288385193285386248';

const builder = new ButtonBuilder()
    .setCustomId('northClubApplyButton')
    .setLabel('📋 Apply')
    .setStyle(ButtonStyle.Primary);

/**
 * Sends a new message with a "THE NORTH Club Apply" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addnorthClubApplyButton(interaction) {

    // Make a button using the discord builder module.
    try {
        const row = new ActionRowBuilder()
            .addComponents(
                builder
            );
        // Add component to existing message.
        await interaction.channel.send({ components: [row] });

    } catch (error) {
        // Catch any potential errors.
        log.bug('[northClubApplyButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug(`[northClubApplyButton] Error sending interaction reply: ${editError}`));
    }
}

module.exports = {
    enabled: true,
    name: 'northClubApplyButton',
    builder,
    addnorthClubApplyButton,
    async execute(interaction) { // Logic when user interact with this button.
        
        try {
            // Check if interaction user is already a club member.
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (member.roles.cache.has(northMemberRoleID)) {
                return interaction.reply({ content: `${findEmoji(interaction.client, emojiList.verify)} You are already a club member of **Laezaria**!`, ephemeral: true });
            }

            // Display THE NORTH club application modal to the user.
            showNorthClubApplyModal(interaction);

        } catch (error) {
            log.bug('[laezClubApplyButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.reply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((responseError) => log.bug('[laezClubApplyButton] Error editing interaction reply:', responseError));
        }
    }
};