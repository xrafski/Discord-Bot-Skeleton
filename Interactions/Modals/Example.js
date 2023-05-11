const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const log = require('../../Addons/Logger');
const path = require('path');
const { InteractionError } = require('../../Addons/Classes');
const { EmojiEnums } = require('../../Addons/Enums');

// Get file name.
const fileName = path.basename(__filename).slice(0, -3);

async function showExampleModal(interaction) {

    // Make a modal using the discord builder module.
    try {
        // Destructuring assignment.
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/${fileName}] Interaction modal used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        // Create the modal
        const exampleModal = new ModalBuilder()
            .setCustomId(fileName)
            .setTitle('My example modal');

        // Create the text input components
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('favoriteColorInput')
            // The label is the prompt the user sees for this input
            .setLabel('What\'s your favorite color?')
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const hobbiesInput = new TextInputBuilder()
            .setCustomId('hobbiesInput')
            .setLabel('What\'s some of your favorite hobbies?')
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const gameInput = new TextInputBuilder()
            .setCustomId('gameInput')
            .setLabel('What\'s your favorite game?')
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(gameInput);

        // Add inputs to the modal.
        exampleModal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user.
        await interaction.showModal(exampleModal);

    } catch (error) {
        new InteractionError(interaction, fileName).issue(error);
    }
}

// Export logic that will be executed when the modal is submitted.
module.exports = {
    enabled: false,
    name: fileName,
    showExampleModal, // Function to show modal to the user. Used on different files as: showExampleModal(interaction)
    async execute(interaction, args) { // That handles the interation submit response.

        try {
            // Destructuring assignment.
            const { user, guild } = interaction;
            log.debug(args);

            // Log who used the command.
            log.info(`[/${fileName}] Modal executed by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

            // Send a reply to the user.
            const reply = await interaction.reply({ content: `${EmojiEnums.LOADING} Preparing reseponse...`, ephemeral: true });

            // Fake delay to appear as if the bot is doing something 😂
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Edit the reply
            await reply.edit({ content: `${fileName} response is handled correctly.` });

        } catch (error) {
            new InteractionError(interaction, fileName).issue(error);
        }
    }
};