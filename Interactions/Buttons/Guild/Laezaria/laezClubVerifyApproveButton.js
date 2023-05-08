const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');
const path = require('path');
const { EmojiEnums } = require('../../../../Addons/Enums');
const { InteractionError } = require('../../../../Addons/Classes');
const { LaezariaEnums } = require('../../../../Addons/TempEnums');

// Get file name.
const fileName = path.basename(__filename).slice(0, -3);

const laezClubVerifyApproveButtonBuilder = new ButtonBuilder()
    .setCustomId(fileName)
    .setLabel('Approve')
    .setStyle(ButtonStyle.Success);

module.exports = {
    enabled: true,
    name: fileName,
    laezClubVerifyApproveButtonBuilder,
    async execute(interaction) { // Logic when user interacts with this button.

        try {
            // Log who used this interaction.
            log.info(`[${fileName}] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Create reply to defer the button execution.
            await interaction.reply({ content: `${EmojiEnums.LOADING} Preparing response...`, ephemeral: true });

            // Variable with original embed data.
            const originalEmbed = await interaction.message.embeds[0];

            // Get a new embed instance for this interaction message.
            const newEmbed = new EmbedBuilder()
                .setTitle(originalEmbed.title)
                .setDescription(`${EmojiEnums.APPROVE} Request is **CLOSED** and approved by ${interaction.user}.`)
                .setColor('Green')
                .setThumbnail(originalEmbed.thumbnail.url)
                .setFooter(originalEmbed.footer)
                .setTimestamp()
                .setFields(originalEmbed.fields);

            // Change applicant server's nickname and assign a member role.
            const userMember = await interaction.guild.members.fetch(newEmbed.data.footer.text);
            await userMember.setNickname(newEmbed.data.fields[2].value.replace(/`/g, '')); // Get field value with a nickname and remove backticks.
            await userMember.roles.add(LaezariaEnums.MEMBER_ROLE_ID);

            // Send user a Direct Message with the request response status.
            const dmEmbed = new EmbedBuilder()
                .setTitle('Verification Request Response!')
                .setDescription(`Your Verification Request to **Laezaria** has been approved ${EmojiEnums.APPROVE}\nAccepted by: ${interaction.user}!`)
                .setColor('Green')
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setImage(LaezariaEnums.APPROVED_URL);

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
            new InteractionError(interaction, fileName).issue(error);
        }
    }
};