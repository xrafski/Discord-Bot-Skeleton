const log = require('../../Addons/Logger');

module.exports = {
    enabled: true,
    name: 'exampleButton',
    async execute(client, interaction) {

        try {
            await interaction.reply({ content: 'You clicked the example button!', ephemeral: true });
        } catch (error) {
            log.bug('[exampleButton] Interaction error', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((editError) => log.bug(`[exampleButton] Error editing interaction reply: ${editError}`));
        }
    }
};
