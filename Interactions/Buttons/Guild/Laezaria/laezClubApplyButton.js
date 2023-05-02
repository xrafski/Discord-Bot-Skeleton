const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { showLaezClubApplyModal } = require('../../../Modals/Guild/Laezaria/laezClubApplyModal');

const laezClubApplyButtonBuilder = new ButtonBuilder()
    .setCustomId('laezClubApplyButton')
    .setLabel('Apply to the club!')
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
                laezClubApplyButtonBuilder
            );

        // Add component to existing message.
        await interaction.channel.send({ content: '', components: [row] });

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
    laezClubApplyButtonBuilder,
    addlaezClubApplyButton,
    async execute(interaction) { // Logic when user interact with this button.

        try {
            // FIX IT (NOT FINISHED)
            // await interaction.reply({ content: 'You clicked the **laezClubApplyButton**!\n*Now with additional logic you can do something with it!*', ephemeral: true });
            // const guild = interaction.guild
            // const member = await guild.members.fetch(interaction.user.id)

            // if (member.roles.cache.has(laezmemberRole)) {

            //     interaction.reply({ content: "You are already a Club Member of Laezaria", ephemeral: true })
            //     return;
            // }

            showLaezClubApplyModal(interaction); // Dislay the laezaria club application modal to the user.



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
