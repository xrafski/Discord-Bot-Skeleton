const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const log = require('../../Addons/Logger');
const path = require('path');
const { InteractionError } = require('../../Addons/Classes');

// Get file name.
const fileName = path.basename(__filename).slice(0, -3);

/**
 * Adds a selection menu using the Discord builder module to the specified message.
 * @param {Interaction} interaction - The interaction that triggered this command.
 * @param {Object} message - The message object to add the selection menu to.
 * @returns {Promise<Message>} A Promise that resolves with the updated message with the selection menu added.
 */
async function addExampleMenu(interaction, message) {

    // Make a selection menu using the discord builder module.
    try {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(fileName)
                    .setPlaceholder('Nothing selected')
                    .setMinValues(1)
                    .setMaxValues(3)
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                        {
                            label: 'I am also an option',
                            description: 'This is a description as well',
                            value: 'third_option',
                        },
                    ]),
            );

        return await message.edit({ components: [row] });

    } catch (error) {
        new InteractionError(interaction, fileName).issue(error);
    }
}

// Export logic that will be executed when the selection menu option is selected.
module.exports = {
    enabled: false,
    name: fileName,
    addExampleMenu, // Function to add selection menu component to a provided message object. Used on different files as: addExampleMenu(interaction, message)
    async execute(interaction, args) { // That handles the interation submit response.

        try {
            // Destructuring assignment.
            const { user, guild } = interaction;

            // Log who used the command.
            log.info(`[/${fileName}] Menu executed by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

            // Send a message confirming that the form has been submitted successfully.
            await interaction.reply({ content: `You selected '${args.join('\', ')}' option(s) in exampleMenu.\n**Now with additional logic you can do something with it!**`, ephemeral: true });

        } catch (error) {
            new InteractionError(interaction, fileName).issue(error);
        }
    }
};