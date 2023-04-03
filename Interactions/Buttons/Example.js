const log = require('../../Addons/Logger');

module.exports = {
    enabled: true,
    name: 'exampleButton',
    description: 'This is an example button!',
    async execute(client, interaction) {

        try {
            await interaction.reply({ content: 'You clicked the example button!', ephemeral: true });
        } catch (error) {
            log.bug('[exampleButton] Error to run this button.', error);
        }
    }
};
