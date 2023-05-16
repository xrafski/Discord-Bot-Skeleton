const { ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { showLaezClubVerifyModal } = require('../../../Modals/Guild/Laezaria/laezClubVerifyModal');
const path = require('path');
const { InteractionError } = require('../../../../Addons/Classes');

// Get file name.
const fileName = path.basename(__filename).slice(0, -3);

const laezClubVerifyButtonBuilder = new ButtonBuilder()
    .setCustomId(fileName)
    .setLabel('Nickname Verification')
    .setEmoji('📝')
    .setStyle(ButtonStyle.Primary);

module.exports = {
    enabled: true,
    name: fileName,
    builder: laezClubVerifyButtonBuilder,
    async execute(interaction) { // Logic when user interact with this button.

        try {
            // Log who used this interaction.
            log.info(`[${fileName}] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Display the laezaria verification modal to the user.
            showLaezClubVerifyModal(interaction);
        } catch (error) {
            new InteractionError(interaction, fileName).issue(error);
        }
    }
};