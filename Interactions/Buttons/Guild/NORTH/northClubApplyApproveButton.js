const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { northClubApplyConfirmInviteButtonBuilder } = require('../northClubApplyConfirmInviteButton')
const { northClubApplyRequestInviteButtonBuilder } = require('../northClubApplyRequestInviteButton')
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');

// Variables
const northMemberRoleID = '288385193285386248';
// const approveIcon = '';
const grandcounsilRole = "288382736480337920"
const kingsguardRole = "438818482692423683"
const knightRole = "455248257161887754"
const staffRole = "623160704492634112"
const devRole = "1095126923740463106"
const adminRoleId = "570764875350147092"

// Button builder for THE NORTH's approve button.
const northClubApplyApproveButtonBuilder = new ButtonBuilder()
    .setCustomId('northClubApplyApproveButton')
    .setLabel('Approve')
    .setStyle(ButtonStyle.Success);

/**
 * Sends a new message with a "THE NORTH Club Apply" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addNorthClubApplyApproveButton(interaction) {

    try {
        // Make a button using the discord builder module.
        const row = new ActionRowBuilder()
            .addComponents(
                northClubApplyApproveButtonBuilder
            );

        // Send a message with the button component.
        await interaction.channel.send({ components: [row] });

    } catch (error) {
        log.bug('[northClubApplyApproveButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug('[northClubApplyApproveButton] Error sending interaction reply:', editError));
    }
}

module.exports = {
    enabled: true,
    name: 'northClubApplyApproveButton',
    northClubApplyApproveButtonBuilder,
    addNorthClubApplyApproveButton,
    async execute(interaction) {// Logic when user interact with this button

        try {
            // Log who used this interaction.
            log.info(`[northClubApplyApproveButton] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Create reply to defer the button execution.
            const reply = await interaction.reply({ content: `${findEmoji(interaction.client, emojiList.loading)} Preparing response...`, ephemeral: true });
            // reply.edit({ content: 'This button is missing additional logic!' });

            // Check if interactor has the necessary permissions to interact with this button
            const member = await interaction.guild.members.fetch(interaction.user.id)
            if (!member.roles.cache.has(grandcounsilRole) && !member.roles.cache.has(devRole) && !member.roles.cache.has(adminRoleId)) {
                interaction.reply({ content: "You are not Authorised to perform this action!", ephemeral: true})

                setTimeout(async () => {
                    try {
                        await interaction.deleteReply()
                    } catch (error) {
                        console.error(error)
                    }
                }, 2000)

                return;
            }

            // Variable with original embed data
            const originalEmbed = await interaction.message.embeds[0]

            // Get a new embed instance for this interaction message.
            const newEmbed = new EmbedBuilder()
                .setTitle(originalEmbed.title)
                .setDescription(`${findEmoji(interaction.client, emojiList.approve)} Request is **CLOSED** and approved by ${interaction.user}.`)
                .setColor('Green')
                .setImage(originalEmbed.image.url)
                .setThumbnail(originalEmbed.thumbnail.url)
                .setFooter(originalEmbed.footer)
                .setTimestamp()
                .setFields(originalEmbed.fields);

            // Create a embed to notify applicant that their club application has been approved
            const dmEmbed = new EmbedBuilder()
                .setTitle('Congratulation! Your Application to THE NORTH Has been Approved')
                .setDescription("You are now a part of THE NORTH, all that is left to do is invite you to the club on Trove!")
                .setColor(0x0000FF)
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(originalEmbed.thumbnail.url)
                .setFields({
                    name: "Club Invite Step",
                    value: "It's Simple, All you have to do is, when you are in game and ready to join, press the request button below and it will inform our Staff team that you are ready to join!\nEnjoy!"
                })

            // Boolean variable to indicate whether direct message is received or not.
            let dmSentBoolean = true;

            // ActionRow with applicant button to request for an invite to the club
            const applicantApplicationActionRow = new ActionRowBuilder()
                .addComponents(northClubApplyRequestInviteButtonBuilder)

            // Send a direct message to the applicant with application results.
            const userMember = await interaction.guild.members.fetch(newEmbed.data.footer.text);
            await userMember.send({ embeds: [dmEmbed], components: [applicantApplicationActionRow] })
                .catch(() => dmSentBoolean = false); // Change dmSentBoolean variable to false if DM wasn't sent successfully.
            
            // String with summary for user that interacted.
            let summaryString = `You have approved ${newEmbed.data.fields[0].value}'s application successfully.`;

            // Check if applicantreceived a direct message and update summary string accordingly.
            if (!dmSentBoolean) {
                summaryString = summaryString + `\nHowever, direct message is not received due to privacy settings of this user.`;
            }

            // ActionRow with staff button to confirm the invitation of applicant upon approval
            const staffApplicationActionRow = new ActionRowBuilder()
                .addComponents(northClubApplyConfirmInviteButtonBuilder)

            // Replace old embed with a new one and add request button.
            interaction.message.edit({ embeds: [newEmbed], components: [staffApplicationActionRow] })
                .then(() => {
                    // Edit initial reply with a summary string.
                    interaction.editReply({ content: summaryString, ephemeral: true })
                })

        } catch (error) { // Catch any potential errors.
            log.bug('[northClubApplyApproveButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
            }).catch((responseError) => log.bug('[northClubApplyApproveButton] Error editing interaction reply:', responseError));
        }

    }
};