const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');

// Variables
const memberRoleID = '1104440858004181033';
const guestRoleID = '1104450320261713930';
const grandCounsilRoleID = '1104437369559601244';
const kingsGuardRoleID = '1104450397260763266';
const knightRoleID = '1104450515842105496';
const devRoleID = '1104437516154712064';
const adminRoleID = '1104437669951438879';

// Button builder for THE NORTH's Confirm invite Button.
const northClubApplyConfirmInviteButtonBuilder = new ButtonBuilder()
    .setCustomId('northClubApplyConfirmInviteButton')
    .setLabel('Confirm')
    .setStyle(ButtonStyle.Success);

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
        await interaction.channel.send({ components: [row] });

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

            // Create reply to defer the button execution.
            const reply = await interaction.reply({ content: `${findEmoji(interaction.client, emojiList.loading)} Preparing response...`, ephemeral: true });

            // Check if interactor has permission to interact with the button.
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (!member.roles.cache.has(grandCounsilRoleID) && !member.roles.cache.has(kingsGuardRoleID) && !member.roles.cache.has(knightRoleID) && !member.roles.cache.has(devRoleID) && !member.roles.cache.has(adminRoleID)) {
                return reply.edit({ content: 'You are not authorised to perform this action!' });
            }

            // Variable with original embed data
            const originalEmbed = await interaction.message.embeds[0];
            const originalEmbedDescription = originalEmbed.description.split('\n');

            // Get a new embed instance for this interaction message.
            const newEmbed = new EmbedBuilder()
                .setTitle('Application succesfully finished')
                .setDescription(`${findEmoji(interaction.client, emojiList.approve)} Request is **CLOSED**\n${originalEmbedDescription[1]} and confirmed by ${interaction.user}.`)
                .setColor('Green')
                .setImage(originalEmbed.image.url)
                .setThumbnail(originalEmbed.thumbnail.url)
                .setFooter(originalEmbed.footer)
                .setTimestamp()
                .setFields(originalEmbed.fields);

            // Change applicant's server nickname and roles
            const userMember = await interaction.guild.members.fetch(newEmbed.data.footer.text);
            await userMember.setNickname(newEmbed.data.fields[2].value.replace(/`/g, ''));
            await userMember.roles.add(memberRoleID);
            await userMember.roles.remove(guestRoleID);

            // Edit the interacted message to the new embed and remove components.
            interaction.message.edit({ embeds: [newEmbed], components: [] });

            // Send the response to the interaction.
            reply.edit({ content: 'You have successfully confirmed this application!' });

        } catch (error) {
            log.bug('[northClubApplyConfirmInviteButton] Interaction button error', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
            }).catch((responseError) => log.bug('[northClubApplyConfirmInviteButton] Error editing interaction reply:', responseError));
        }
    }
};