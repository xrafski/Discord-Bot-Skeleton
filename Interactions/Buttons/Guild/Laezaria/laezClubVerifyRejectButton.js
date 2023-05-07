const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { showLaezClubVerifyRejectReasonModal } = require('../../../Modals/Guild/Laezaria/laezClubVerifyRejectReasonModal');
const path = require('path');

// Variables
const fileName = path.basename(__filename).slic(0, -3)

// Button builder for laezaria's reject button.
const laezClubVerifyRejectButtonBuilder = new ButtonBuilder()
    .setCustomId(fileName)
    .setLabel('Reject')
    .setStyle(ButtonStyle.Danger);

// Not creating addLaezClubVerifyRejectButton function because its not needed on its own.

module.exports = {
    enabled: true,
    name: fileName,
    laezClubVerifyRejectButtonBuilder,
    async execute(interaction) { // Logic when use interacts with this button.

        try {
            // Log who used this interaction.
            log.info(`[${fileName}] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Display modal to the interaction.user interface.
            showLaezClubVerifyRejectReasonModal(interaction); // Entire logic to reject application is under this reason modal.

        } catch (error) {
            log.bug(`[${fileName}] Interaction button error`, error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
            }).catch((responseError) => log.bug(`[${fileName}] Error editing interaction reply:`, responseError));
        }

    }
}