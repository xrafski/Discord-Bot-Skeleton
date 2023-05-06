const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { showLaezClubVerifyModal } = require('../../../Modals/Guild/Laezaria/laezClubVerifyModal');
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');
const path = require('path');

// Variables
const fileName = path.basename(__filename).slice(0, -3);
const laezariaMemberRoleID = '1099703236983791698';

const laezClubVerifyButtonBuilder = new ButtonBuilder()
    .setCustomId(fileName)
    .setLabel('CHANGEME')
    .setStyle(ButtonStyle.Primary);

/**
 * Sends a new message with a "CHANGEME" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addLaezClubVerifyButton(interaction) {
    
    // Make a button using the discord builder module.
    try {
        const row = new ActionRowBuilder()
            .addComponents(
                laezClubVerifyButtonBuilder
            );
        
        // Add component to existing message.
        await interaction.channel.send({ components: [row] });

    } catch (error) {
        // Catch any potential errors.
        log.bug(`[${fileName}] Interaction button error:`, error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug(`[${fileName}] Error sending interaction reply: ${editError}`));
    }
}

module.exports = {
    enabled: true,
    name: fileName,
    laezClubVerifyButtonBuilder,
    addLaezClubVerifyButton,
    async execute(interaction) { // Logic when user interact with this button.

        try {
            // Display the laezaria verification modal to the user.
            showLaezClubVerifyModal
            
        } catch (error) {
        // Catch any potential errors.
        log.bug(`[${fileName}] Interaction button error:`, error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug(`[${fileName}] Error sending interaction reply: ${editError}`));
        }
    }
}