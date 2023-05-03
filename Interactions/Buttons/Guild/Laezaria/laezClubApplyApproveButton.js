const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');

// Variables
const laezMemberRoleID = '1099703236983791698';
const approvedIcon = 'https://i.imgur.com/DQwdu0u.png';

// Button builder for laezaria's approve button.
const laezClubApplyApproveButtonBuilder = new ButtonBuilder()
    .setCustomId('laezClubApplyApproveButton')
    .setLabel('Approve')
    .setStyle(ButtonStyle.Success);

/**
 * Sends a new message with a "Laezaria Club Apply" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addlaezClubApplyApproveButton(interaction) {

    try {
        // Make a button using the discord builder module.
        const row = new ActionRowBuilder()
            .addComponents(
                laezClubApplyApproveButtonBuilder
            );

        // Send a message with the button component.
        await interaction.channel.send({ components: [row] });

    } catch (error) { // Catch any potential errors.
        log.bug('[laezClubApplyApproveButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug('[laezClubApplyApproveButton] Error sending interaction reply:', editError));
    }
}

module.exports = {
    enabled: true,
    name: 'laezClubApplyApproveButton',
    laezClubApplyApproveButtonBuilder,
    addlaezClubApplyApproveButton,
    async execute(interaction) { // Logic when user interact with this button.

        try {
            // Log who used this interaction.
            log.info(`[laezClubApplyApproveButton] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Create reply to defer the button execution.
            await interaction.reply({ content: `${findEmoji(interaction.client, 'loading')} Preparing response...`, ephemeral: true });

            // Variable with original embed data.
            const originalEmbed = await interaction.message.embeds[0];

            // Get a new embed instance for this interaction message.
            const newEmbed = new EmbedBuilder()
                .setTitle(originalEmbed.title)
                .setDescription(`${findEmoji(interaction.client, emojiList.approve)} Request is **CLOSED** and approved by ${interaction.user}.`)
                .setColor('Green') // https://discord.js.org/#/docs/discord.js/main/typedef/ColorResolvable
                .setImage(approvedIcon)
                .setThumbnail(originalEmbed.thumbnail.url)
                .setFooter(originalEmbed.footer)
                .setTimestamp()
                .setFields(originalEmbed.fields);

            // Change applicant server's nickname and assign a member role.
            const userMember = await interaction.guild.members.fetch(newEmbed.data.footer.text);
            await userMember.setNickname(newEmbed.data.fields[2].value.replace(/`/g, '')); // Get field value with a nickname and remove backticks.
            await userMember.roles.add(laezMemberRoleID);

            // Send user a Direct Message with the request response status.
            const dmEmbed = new EmbedBuilder()
                .setTitle('Application Response!')
                .setDescription(`Your Application to **Laezaria** has been approved ${findEmoji(interaction.client, emojiList.approve)}\nAccepted by: ${interaction.user}!`)
                .setColor('Green')
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setImage(approvedIcon);

            // Boolean variable to indicate whether direct message is received or not.
            let dmSentBoolean = true;

            // Send a direct message to the applicant with application results.
            await userMember.send({ embeds: [dmEmbed] })
                .catch(() => dmSentBoolean = false); // Change dmSentBoolean variable to false if DM wasn't sent successfully.

            // String with summary for user that interacted.
            let summaryString = `You have approved ${newEmbed.data.fields[0].value}'s application successfully.`;

            // Check if applicant received a direct message and update summary string accordingly.
            if (!dmSentBoolean) {
                summaryString = summaryString + '\nHowever, direct message is not received due to privacy settings of this user.';
            }

            // Replace old embed with a new one and remove components.
            interaction.message.edit({ embeds: [newEmbed], components: [] })
                .then(() => {
                    // Edit initial reply with a summary string.
                    interaction.editReply({ content: summaryString, ephemeral: true });
                });

        } catch (error) { // Catch any potential errors.
            log.bug('[laezClubApplyApproveButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
            }).catch((responseError) => log.bug('[laezClubApplyApproveButton] Error editing interaction reply:', responseError));
        }
    }
};
