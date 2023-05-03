const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../Addons/Logger');

const builder = new ButtonBuilder()
    .setCustomId('exampleButton')
    .setLabel('Click me!')
    .setStyle(ButtonStyle.Danger);

async function addExampleButton(interaction) {

    // Make a button using the discord builder module.
    try {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('exampleButton')
                    .setLabel('Click me!')
                    .setStyle(ButtonStyle.Primary),
            );

        // Add component to existing message.
        await interaction.channel.send({ content: '', components: [row] });

    } catch (error) {
        // Catch any potential errors.
        log.bug('[exampleButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug(`[exampleButton] Error sending interaction reply: ${editError}`));
    }
}

module.exports = {
    enabled: true,
    name: 'exampleButton',
    builder, // The example button builder.
    addExampleButton, // Function to add a button component to a provided message object. Used on different files as: addExampleButton(interaction, message)
    async execute(interaction) {

        try {
            await interaction.reply({ content: 'You clicked the example button!\n**Now with additional logic you can do something with it!**', ephemeral: true });
        } catch (error) {
            log.bug('[exampleButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.reply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((responseError) => log.bug(`[exampleButton] Error editing interaction reply: ${responseError}`));
        }
    }
};
