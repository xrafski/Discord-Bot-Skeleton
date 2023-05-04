const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { northClubApplyApproveButton } = require('../../../Buttons/Guild/NORTH/northClubApplyApproveButton')
const { northClubApplyRejectButton } = require('../../../Buttons/Guild/NORTH/northClubApplyRejectButton')
const { findEmoji } = require('../../../../Addons/findEmoji');

// Variables
const failedProofImage = 'https://cdn.discordapp.com/attachments/756494646678519878/758105625594036295/image0_1.png'
const inboxChannelID = '1095111479449092276'

async function showNorthClubApplyModal(interaction) {
    // Log who used this interaction
    log.info(`[northClubApplyModal] Interaction used by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

    // Make a modal using the discord builder module
    try {
        // Create the modal
        const northClubApplyModalBuilder = new ModalBuilder()
        .setCustomId('northClubApplyModal')
        .setTitle('THE NORTH Club Application');

        // Create the text input components
        const northApplyQ1Input = new TextInputBuilder()
            .setCustomId('northApplyQ1')
            .setLabel('Key in your Trove In Game Name')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('E.g. Surge')
            .setMinLength(3)
            .setMaxLength(20)
            .setRequired(true);

        const northApplyQ2Input = new TextInputBuilder()
            .setCustomId('northApplyQ2')
            .setLabel('What about Trove keeps you playing')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('E.g. Trove is fun...')
            .setRequired(true);

        const northApplyQ3Input = new TextInputBuilder()
            .setCustomId('northApplyQ3')
            .setLabel('What can you tell us about yourself?')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('E.g. My Hobbies are...')
            .setRequired(true);

        const northApplyQ4Input = new TextInputBuilder()
            .setCustomId('northApplyQ4')
            .setLabel('Why do you want to join The North?')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('E.g. Because The North is...')
            .setRequired(true);    

        const northApplyQ5Input = new TextInputBuilder()
            .setCustomId('northApplyQ5')
            .setLabel('Image Proof for your Total Mastery Rank')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Image URL')
            .setRequired(false);

        // Add inputs to the modal.
        northClubApplyModalBuilder.addComponents(
            new ActionRowBuilder().addComponents(northApplyQ1Input),
            new ActionRowBuilder().addComponents(northApplyQ2Input),
            new ActionRowBuilder().addComponents(northApplyQ3Input),
            new ActionRowBuilder().addComponents(northApplyQ4Input),
            new ActionRowBuilder().addComponents(northApplyQ5Input),
        );

        // Show the modal to the user.
        await interaction.showModal(northClubApplyModalBuilder);

    } catch (error) {
        // Catch any potential errors.
        log.bug('[northClubApplyModal] Interaction error:', error);
    }
}

// Export logic that will be executed when the modal is submitted.
module.exports = {
    enabled: true,
    name: 'northClubApplyModal',
    showNorthClubApplyModal, // Function to show modal to the user. Used on different files as: showNorthClubApplyModal(interaction)
    async execute(interaction, args) { // That handles the interaction submit response.

        /**
         * Checks if a URL is a valid image URL.
         * @param {string} url - The URL to check.
         * @returns {boolean} `true` if the URL is a valid image URL, `false` otherwise.
         */
        function isImage(url) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg|JPG|JPEG|PNG|WEBP|AVIF|GIF|SVG)$/.test(url);
        }

        try {
            // Log who executed this interaction.
            log.info(`[northClubApplyModal] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);
            
            const [ nickname, whatPlaying, aboutYourself, whyJoin, proofImage ] = args; // Destructuring assignment
            const userResponses = { nickname, whatPlaying, aboutYourself, whyJoin, proofImage } // Object with user responses provided with the modal
            let imgProofImage = userResponses.proofImage; // Variable to check if proof image is actually an image.

            // If isImage() returns false for proofImage.
            if (isImage(imgProofImage) === false) {
                imgProofImage = failedProofImage
            }

            // An embed builder to gather all information about the applicant and its responses for guild staff members.
            const applicationEmbed = new EmbedBuilder()
                .setTitle('Application to join THE NORTH')
                .setDescription(`${findEmoji(interaction.client, 'loading')} Request is **OPEN and awaiting staff approval`)
                .setImage(imgProofImage)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({ text: interaction.user.id, iconURL: interaction.client.user.displayAvatarURL() })
                .setFields(
                    {
                        name: 'Discord User',
                        value: `<@${interaction.user.id}>`,
                        inline: true,
                    },
                    {
                        name: 'Discord Tag',
                        value: `${interaction.user.tag}`,
                        inline: true,
                    },
                    {
                        name: 'Trove In game Name',
                        value: `\`\`\`${userResponses.nickname}\`\`\``,
                    },
                    {
                        name: 'What about Trove keeps you playing?',
                        value: `\`\`\`${userResponses.whatPlaying}\`\`\``
                    },
                    {
                        name: 'What can you tell us about yourself?',
                        value: `\`\`\`${userResponses.aboutYourself}\`\`\``
                    },
                    {
                        name: 'Why do you want to join The North?',
                        value: `\`\`\`${userResponses.whyJoin}\`\`\``
                    },
                    {
                        name: "Image for proof of Total Mastery Level ",
                        value: "If you do not see a image of proof, it means the Applicant either did not give a valid Image URL or left this part Blank"
                    },
                    {
                        name: 'Raw Image URL',
                        value: `\`\`\`${userResponses.proofImage}\`\`\``
                    },
                );

            // ActionRow with staff buttons to either approve or reject the user application.
            const staffApplicationActionRow = new ActionRowBuilder()
                .addComponents(northClubApplyApproveButton, northClubApplyRejectButton);

            
            // Get the channel object where to send the application message.
            const inboxChannel = interaction.guild.channels.cache.get(inboxChannelID);
            // Throw exception if channel is not found.
            if (!inboxChannel) throw new Error(`inboxChannel variable returns undefined which means this channel ID '${inboxChannelID}' is either invalid or has been removed from this guild`);
            // Send message with the embed button components to accept or reject application.
            await inboxChannel.send({ embeds: [applicationEmbed], components: [staffApplicationActionRow] });

            // Send a reply message confirming that the form has been submitted successfully.
            await interaction.reply({ content: '**You submitted application to the club!**\nNow you need to wait for a staff member to either approve or reject your reques.', ephemeral: true })
        } catch (error) {
            log.bug('[northClubApplyModal] Error to execute this modal:', error);
        }

    }
}