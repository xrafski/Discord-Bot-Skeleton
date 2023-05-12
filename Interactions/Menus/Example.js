const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const log = require('../../Addons/Logger');
const path = require('path');
const { InteractionError } = require('../../Addons/Classes');
const { EmojiEnums } = require('../../Addons/Enums');

// Get file name.
const fileName = path.basename(__filename).slice(0, -3);

const exampleMenuBuilder = new StringSelectMenuBuilder()
    .setCustomId(fileName)
    .setPlaceholder('Nothing selected')
    .setMinValues(1)
    .setMaxValues(3)
    .addOptions([
        {
            label: 'First',
            description: 'This is a description',
            value: 'first_option',
        },
        {
            label: 'Second',
            description: 'This is also a description',
            value: 'second_option',
        },
        {
            label: 'Third',
            description: 'This is a description as well',
            value: 'third_option',
        },
    ]);

/**
 * Adds a selection menu using the Discord builder module to the specified message.
 * @param {Interaction} interaction - The interaction that triggered this command.
 * @param {Object} message - The message object to add the selection menu to.
 * @returns {Promise<Message>} A Promise that resolves with the updated message with the selection menu added.
 */
async function addExampleMenu(interaction, message) {

    // Make a selection menu using the discord builder module.
    try {
        const exampleMenuRow = new ActionRowBuilder()
            .addComponents(exampleMenuBuilder);

        // Edit the message's components.
        await message.edit({ components: [exampleMenuRow] });

    } catch (error) {
        new InteractionError(interaction, fileName).issue(error);
    }
}

// Export logic that will be executed when the selection menu option is selected.
module.exports = {
    enabled: false,
    name: fileName,
    builder: exampleMenuBuilder,
    addExampleMenu, // Function to add selection menu component to a provided message object. Used on different files as: addExampleMenu(interaction, message)
    async execute(interaction, args) { // That handles the interation submit response.
        try {

            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: `${EmojiEnums.LOADING} Preparing reseponse...`, ephemeral: true });

            // Log with interaction arguments.
            log.debug('Arguments:', args);

            // Fake delay to appear as if the bot is doing something 😂
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Edit the reply
            await reply.edit({ content: `${fileName} response is handled correctly.` });

        } catch (error) {
            new InteractionError(interaction, fileName).issue(error);
        }
    }
};