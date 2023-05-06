const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');

// Variables
const inboxChannelID = '1095111479449092276'
const guildID = '288378882418016256'
const memberRole = '288385193285386248'

// Button builder for THE NORTH's Request invite button.
const northClubApplyRequestInviteButtonBuilder = new ButtonBuilder()
    .setCustomId('northClubApplyRequestInviteButton')
    .setLabel('Request')
    .setStyle(ButtonStyle.Success);

/**
 * Sends a new message with a "EDIT THIS!!!" button component in interaction channel.
 *
 * @param {import("discord.js").CommandInteraction} interaction - The interaction object.
 * @returns {Promise<void>} A Promise that resolves when the button is added successfully, or rejects if an error occurs.
 */
async function addnorthClubApplyRequestInviteButton(interaction) {
   
    try {
        // Make a button using the discord builder module.
        const row = new ActionRowBuilder()
            .addComponents(
                northClubApplyRequestInviteButtonBuilder
            );

        // Send a message with the button component.
        await interaction.channel.send({ components: [row] });

    } catch (error) { // Catch any potential errors.
        log.bug('[northClubApplyRequestInviteButton] Interaction button error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug('[northClubApplyRequestInviteButton] Error sending interaction reply:', editError));
    }
}

module.exports = {
    enabled: true,
    name: 'northClubApplyRequestInviteButton',
    northClubApplyRequestInviteButtonBuilder,
    addnorthClubApplyRequestInviteButton,
    async execute(interaction) { // Logic when user interact with this button.

        try {
            // Log who executed this interaction.
            log.info(`[northClubApplyRequestInviteButton] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            // Create reply to defer the button execution.
            await interaction.reply({ content: `${findEmoji(interaction.client, emojiList.loading)} Preparing response...`, ephemeral: true });

            // Create a Request Sent Embed
            const requestSentEmbed = new EmbedBuilder()
                .setTitle('Request Sent, You should be invited into the club soon!')
                .setDescription('Be patient! you are almost there!')
                .setThumbnail(interaction.user.displayAvatarURL())
                .setColor(0x00FF00)
                .setImage("https://cdn.discordapp.com/attachments/756494646678519878/758105625594036295/image0_1.png")
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURLI() })

            // Edit the interacted message to update to Request Sent embed and remove the request button to prevent spam
            interaction.message.edit({ content: `Great ! The request has been sent!`, embeds: [requestSentEmbed], components: [] })

            // Send message to THE NORTH's inbox channel to inform staff that applicant is ready for a club invite.
            const inboxChannel = await interaction.client.channels.fetch()
            await inboxChannel.send(`<@${interaction.user.id}> is ready to be invited to THE NORTH`)

            // Check if applicant has been invited to the club yet (has the member role) if not send another message to inbox channel tagging Staff members
            setTimeout(async () => {
                const guild = await interaction.client.guilds.fetch()
                const member = await guild.members.fetch(interaction.user.id)
                if (!member.roles.cache.has(memberRole)) {
                    await inboxChannel.send(`<@&${staffRole}>, <@${interaction.user.id}> is ready to be invited to THE NORTH`)
                }
            }, 1000 * 60 * 5);

        } catch (error) {
            log.bug('[northClubApplyRequestInviteButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
            }).catch((responseError) => log.bug('[northClubApplyRequestInviteButton] Error editing interaction reply:', responseError));
        }
    }
}