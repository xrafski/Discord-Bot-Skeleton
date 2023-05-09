const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../Addons/Logger');
const path = require('path');
const { InteractionError } = require('../../Addons/Classes');
const { EmojiEnums } = require('../../Addons/Enums');

// Get file name.
const fileName = path.basename(__filename).slice(0, -3);

const exampleButtonBuilder = new ButtonBuilder()
    .setCustomId(fileName)
    .setLabel('Example Button')
    .setStyle(ButtonStyle.Danger);

async function addExampleButton(interaction) {

    // Make a button using the discord builder module.
    try {
        const row = new ActionRowBuilder()
            .addComponents(
                exampleButtonBuilder
            );

        // Add component to existing message.
        await interaction.channel.send({ content: '', components: [row] });

    } catch (error) {
        new InteractionError(interaction, fileName).issue(error);
    }
}

module.exports = {
    enabled: false,
    name: fileName,
    builder: exampleButtonBuilder, // The example button builder.
    addExampleButton, // Function to add a button component to a provided message object. Used on different files as: addExampleButton(interaction, message)
    async execute(interaction) {

        try {
            // Destructuring assignment.
            const { user, guild } = interaction;

            // Log who used the command.
            log.info(`[/${fileName}] Button executed by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

            // Create reply to defer the command execution.
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
