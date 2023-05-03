const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { showLaezClubApplyModal } = require('../../../Modals/Guild/Laezaria/laezClubApplyModal');
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');

// Variables
const laezariaMemberRoleID = '1099703236983791698';

const builder = new ButtonBuilder()
    .setCustomId('laezClubApplyButton')
    .setLabel('Apply to the club!')
    .setEmoji('📝')
    .setStyle(ButtonStyle.Primary);

/**
 * Sends a new message with a "Laezaria Club Apply" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addlaezClubApplyButton(interaction) {

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
        log.bug('[laezClubApplyButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug(`[laezClubApplyButton] Error sending interaction reply: ${editError}`));
    }
}

module.exports = {
    enabled: true,
    name: 'laezClubApplyButton',
    builder,
    addlaezClubApplyButton,
    async execute(interaction) { // Logic when user interact with this button.

        try {
            // Check if interaction user is already a club member.
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (member.roles.cache.has(laezariaMemberRoleID)) {
                return interaction.reply({ content: `${findEmoji(interaction.client, emojiList.verify)} You are already a club member of **Laezaria**!`, ephemeral: true });
            }

            // Dislay the laezaria club application modal to the user.
            showLaezClubApplyModal(interaction);

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
