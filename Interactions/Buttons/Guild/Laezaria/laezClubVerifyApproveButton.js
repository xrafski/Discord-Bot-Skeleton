const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');
const path = require('path');

// Variables
const fileName = path.basename(__filename).slice(0, -3);
const laezariaMemberRoleID = '1099703236983791698';

const laezClubVerifyApproveButtonBuilder = new ButtonBuilder()
    .setCustomId(fileName)
    .setLabel('Approve')
    .setStyle(ButtonStyle.Primary);

// Not creating addLaezClubVerifyApproveButton function because its not needed on its own.

module.exports = {
    enabled: true,
    name: fileName,
    laezClubVerifyApproveButtonBuilder,
    async execute(interaction) { // Logic when user interacts with this button.

        try {
            // Log who used this interaction.
            log.info(`[${fileName}] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Create reply to defer the button execution.
            await interaction.reply({ content: `${findEmoji(interaction.client, emojiList.loading)} Preparing response...`, ephemeral: true });

            // Variable with original embed data.
            const originalEmbed = await interaction.message.embeds[0];

            // Get a new embed instance for this interaction message.
            const newEmbed = new EmbedBuilder()
                .setTitle(originalEmbed.title)
                .setDescription(`${findEmoji(interaction.client, emojiList.approve)} Request is **CLOSED** and approved by ${interaction.user}.`)
                .setColor('Green') // https://discord.js.org/#/docs/discord.js/main/typedef/ColorResolvable
                .setThumbnail(originalEmbed.thumbnail.url)
                .setFooter(originalEmbed.footer)
                .setTimestamp()
                .setFields(originalEmbed.fields);
                
            // Change applicant server's nickname and assign a member role.
            const userMember = await interaction.guild.members.fetch(newEmbed.data.footer.text);
            await userMember.setNickname(newEmbed.data.fields[2].value.replace(/`/g, '')); // Get field value with a nickname and remove backticks.
            await userMember.roles.add(laezariaMemberRoleID);

            // Send user a Direct Message with the request response status.
            const dmEmbed = new EmbedBuilder()
                .setTitle('Verification Request Response!')
                .setDescription(`Your Verification Request to **Laezaria** has been approved ${findEmoji(interaction.client, emojiList.approve)}\nAccepted by: ${interaction.user}!`)
                .setColor('Green')
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setImage(approvedIcon);

            // Boolean variable to indicate whether direct message is received or not.
            let dmSentBoolean = true;

            // Send a direct message to the applicant with application results.
            await userMember.send({ embeds: [dmEmbed] })
                .catch(() => dmSentBoolean = false); // Change dmSentBoolean variable to false if DM wasn't sent successfully.

            // String with syary for use that interacted.
            let summaryString = `You have approved ${newEmbed.data.fields[0].value}'s Verification request successfully.`;

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
            log.bug(`[${fileName}] Interaction button error`, error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
            }).catch((responseError) => log.bug(`[${fileName}] Error editing interaction reply:`, responseError));
        }
        
    }
}