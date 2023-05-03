const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const log = require('../../Addons/Logger');

/**
 * Adds a selection menu using the Discord builder module to the specified message.
 * @param {Interaction} interaction - The interaction that triggered this command.
 * @param {Object} message - The message object to add the selection menu to.
 * @returns {Promise<Message>} A Promise that resolves with the updated message with the selection menu added.
 */
async function addComponentMenu(interaction, message) {

    // Make a selection menu using the discord builder module.
    try {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('componentMenu')
                    .setPlaceholder('Nothing selected')
                    .setMinValues(1)
                    .setMaxValues(3)
                    .addOptions([
                        {
                            label: 'Application Button',
                            description: 'Component to let discord members apply to the club.',
                            value: 'laezClubApplyButton',
                        },
                        {
                            label: 'Example Button',
                            description: 'Text',
                            value: 'exampleButton',
                        },
                        {
                            label: 'Unknown Button',
                            description: 'Unknown button value to check when invalid button is selected.',
                            value: 'unknown_button',
                        },
                    ]),
            );

        return interaction.editReply({
            content: message, components: [row], ephemeral: true
        });

    } catch (error) {
        // Catch any potential errors.
        log.bug('[COMPONENTMENU] Interaction selection menu error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug('[COMPONENTMENU] Error sending interaction reply:', editError));
    }
}

// Export logic that will be executed when the selection menu option is selected.
module.exports = {
    enabled: true,
    name: 'componentMenu',
    addComponentMenu, // Function to add selection menu component to a provided message object. Used on different files as: addComponentMenu(interaction, message)
    async execute(interaction, args) { // That handles the interation submit response.

        try {
            // Array with button builders.
            const componentArr = [];

            // Get the channel object from the message's mentions
            const channelFromMention = interaction.message.mentions.channels.first();

            // Loop through the args array. For each iteration check if button exist and push into the 'componentArr' array.
            for (const iterator of args) {
                const button = interaction.client.buttons.get(iterator);
                if (button) {
                    componentArr.push(button.builder);
                }
            }

            // Create the ActionRow object with selected components from 'componentArr' Array.
            const row = new ActionRowBuilder()
                .addComponents(componentArr);

            if (!row.components.length) {
                return interaction.reply({ content: 'componentArr[] is empty due to missing components.', ephemeral: true }); // CHANGEME: Make this string more readable for non programming folks.
            }

            // Send the message with components to the 'channelFromMention' object.
            channelFromMention.send({ components: [row] });

            // Send a message confirming that the form has been submitted successfully.
            await interaction.reply({ content: `You selected '${args.join('\', ')}' option(s) for '${channelFromMention}' in componentMenu.\n**Now with additional logic you can do something with it!**`, ephemeral: true });

        } catch (error) {
            log.bug('[COMPONENTMENU] Interaction selection menu error', error);

            // Send an error message to the user.
            await interaction.reply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((responseError) => log.bug('[COMPONENTMENU] Error editing interaction reply:', responseError));
        }
    }
};