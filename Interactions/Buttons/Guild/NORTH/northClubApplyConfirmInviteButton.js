const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');

// Variables
const inboxChannelID = '1095111479449092276'
const guildID = '288378882418016256'
const memberRole = '288385193285386248'
const guestRole = "615837413117526027"
const grandcounsilRole = "288382736480337920"
const kingsguardRole = "438818482692423683"
const knightRole = "455248257161887754"
const staffRole = "623160704492634112"
const devRole = "1095126923740463106"
const adminRoleId = "570764875350147092"

// Button builder for THE NORTH's Confirm invite Button.
const northClubApplyConfirmInviteButtonBuilder = new ButtonBuilder()
    .setCustomId('northClubApplyConfirmInviteButton')
    .setLabel('Confirm')
    .setStyle(ButtonStyle.Success)

/**
 * Sends a new message with a "EDIT THIS!!" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addnorthClubApplyConfirmInviteButton(interaction) {

    try {
        // Make a button using the discord builder module.
        const row = new ActionRowBuilder()
            .addComponents(
                northClubApplyConfirmInviteButtonBuilder
            );
        
        // Send a message with the button component.
        await interaction.channel.send({ components: [row] })

    } catch (error) {
        log.bug('[northClubApplyConfirmInviteButton] Interaction button error', error);

        // Send an error message to the user.
        await interaction.editReply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
        }).catch((responseError) => log.bug('[northClubApplyConfirmInviteButton] Error editing interaction reply:', responseError));
    }
}

module.exports = {
    enabled: true,
    name: 'northClubApplyConfirmInviteButton',
    northClubApplyConfirmInviteButtonBuilder,
    addnorthClubApplyConfirmInviteButton,
    async execute(interaction) { // Logic when user interacts with the button. 
    
        try {
            // Log who executed this interaction.
            log.info(`[northClubApplyConfirmInviteButton] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Check if interactor has permission to interact with the button.
            const member = await interaction.guild.members.fetch(interaction.user.id)
            if (!member.roles.cache.has(grandcounsilRole) && !member.roles.cache.has(kingsguardRole) && !member.roles.cache.has(knightRole) && !member.roles.cache.has(devRole) && !member.roles.cache.has(adminRoleId)) {
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

            // Create reply to defer the button execution.
            await interaction.reply({ content: `${findEmoji(interaction.client, emojiList.loading)} Preparing response...`, ephemeral: true });

            // Variable with original embed data
            const originalEmbed = await interaction.message.embeds[0]

            // Get a new embed instance for this interaction message.
            const newEmbed = new EmbedBuilder()
                .setTitle('Applicant Successfully Invited to THE NORTH')
                .setDescription('Applicant Information (Applicant Invited)')
                .setColor(0x0000FF)
                .setImage(originalEmbed.image.url)
                .setThumbnail(originalEmbed.thumbnail.url)
                .setFooter(originalEmbed.footer)
                .setTimestamp()
                .setFields(originalEmbed.fields);
            
            // Change applicant's server nickname and roles
            const userMember = await interaction.guild.members.fetch(newEmbed.data.footer.text);
            await userMember.setNickname(newEmbed.data.fields[2].value.replace(/`/g, ''));
            await userMember.roles.add(memberRole)
            await userMember.roles.remove(guestRole)

            // Edit the interacted message to the new embed
            interaction.message.edit({ embeds: [newEmbed], components: [] })
            
        } catch (error) {
            log.bug('[northClubApplyConfirmInviteButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
            }).catch((responseError) => log.bug('[northClubApplyConfirmInviteButton] Error editing interaction reply:', responseError));
        }
    }
}