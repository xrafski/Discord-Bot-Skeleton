const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const log = require('../../../../Addons/Logger');
const { laezClubApplyApproveButtonBuilder } = require('../../../Buttons/Guild/Laezaria/laezClubApplyApproveButton');
const { laezClubApplyRejectButtonBuilder } = require('../../../Buttons/Guild/Laezaria/laezClubApplyRejectButton');
const { findEmoji, emojiList } = require('../../../../Addons/findEmoji');

// Variables
const failedProofImage = 'https://i.imgur.com/ReMlAhB.png';
const inboxChannelID = '1103770722586853518';

async function showLaezClubApplyModal(interaction) {
    // Log who used this interaction.
    log.info(`[laezClubApplyModal] Interaction used by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

    // Make a modal using the discord builder module.
    try {
        // Create the modal
        const laezClubApplyModalBuilder = new ModalBuilder()
            .setCustomId('laezClubApplyModal')
            .setTitle('Laezaria Club Application');

        // Create the text input components
        const laezApplyQ1Input = new TextInputBuilder()
            .setCustomId('laezApplyQ1')
            .setLabel('What is your trove in game name?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Example: Laezaria')
            .setMinLength(3)
            .setMaxLength(20)
            .setRequired(true);

        const laezApplyQ2Input = new TextInputBuilder()
            .setCustomId('laezApplyQ2')
            .setLabel('What is the PR on your highest class?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Example: 30,000 PR')
            .setMinLength(5) // 15000, 20000
            .setMaxLength(6) // 15,000, 20 000, 35.000
            .setRequired(true);

        const laezApplyQ3Input = new TextInputBuilder()
            .setCustomId('laezApplyQ3')
            .setLabel('What is your total mastery?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Example: 500 MR')
            .setMinLength(3) // 300, 500 etc.
            .setMaxLength(7) // 300000, 400 000, 500,000, 600.000
            .setRequired(true);

        const laezApplyQ4Input = new TextInputBuilder()
            .setCustomId('laezApplyQ4')
            .setLabel('Why do you want to join this club?')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('I want to join Laezaria because...')
            .setMinLength(10)
            .setMaxLength(500)
            .setRequired(true);

        const laezApplyQ5Input = new TextInputBuilder()
            .setCustomId('laezApplyQ5')
            .setLabel('Image link for PR/Mastery screenshot')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('See \'How to get Image URL\' section')
            .setMinLength(5)
            .setMaxLength(100)
            .setRequired(true);

        // Add inputs to the modal.
        laezClubApplyModalBuilder.addComponents(
            new ActionRowBuilder().addComponents(laezApplyQ1Input),
            new ActionRowBuilder().addComponents(laezApplyQ2Input),
            new ActionRowBuilder().addComponents(laezApplyQ3Input),
            new ActionRowBuilder().setComponents(laezApplyQ4Input),
            new ActionRowBuilder().setComponents(laezApplyQ5Input)
        );

        // Show the modal to the user.
        await interaction.showModal(laezClubApplyModalBuilder);

    } catch (error) {
        // Catch any potential errors.
        log.bug('[laezClubApplyModal] Interaction error:', error);

        // Send an error message to the user.
        await interaction.reply({
            content: '🥶 Something went wrong with this interaction. Please try again later.',
            ephemeral: true
        }).catch((editError) => log.bug('[laezClubApplyModal] Error sending interaction reply:', editError));
    }
}

// Export logic that will be executed when the modal is submitted.
module.exports = {
    enabled: true,
    name: 'laezClubApplyModal',
    showLaezClubApplyModal, // Function to show modal to the user. Used on different files as: showLaezClubApplyModal(interaction)
    async execute(interaction, args) { // That handles the interation submit response.

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
            log.info(`[laezClubApplyModal] Interaction executed by '${interaction.user?.tag}' on the ${interaction.guild?.name ? `'${interaction.guild.name}' guild.` : 'direct message.'}`);

            const [nickname, powerRank, masteryRank, whyJoin, proofImage] = args; // Destructuring assignment
            const userResponses = { nickname, powerRank, masteryRank, whyJoin, proofImage }; // Object with user responses provided within the modal.
            let imgProofImage = userResponses.proofImage; // Variable to check if proof image is actually an image.

            // If isImage() returns false for proofImage.
            if (isImage(imgProofImage) === false) {
                imgProofImage = failedProofImage; // Set the proofImage to the default failure image.
            }

            // An embed builder to gather all information about the applicant and its responses for the guild staff members.
            const applicationEmbed = new EmbedBuilder()
                .setTitle('Application to join Laezaria')
                .setDescription(`${findEmoji(interaction.client, emojiList.loading)} Request is **OPEN** and awaiting staff approval.`)
                .setColor('Yellow') // https://discord.js.org/#/docs/discord.js/main/typedef/ColorResolvable
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
                        name: 'What is your trove in game name?',
                        value: `\`\`\`${userResponses.nickname}\`\`\``,
                    },
                    {
                        name: 'What is the PR on your highest class?',
                        value: `\`\`\`${userResponses.powerRank}\`\`\``
                    },
                    {
                        name: 'What is your total mastery?',
                        value: `\`\`\`${userResponses.masteryRank}\`\`\``
                    },
                    {
                        name: 'Why do you want to join this club?',
                        value: `\`\`\`${userResponses.whyJoin}\`\`\``
                    },
                    {
                        name: 'Raw Image URL',
                        value: `\`\`\`${userResponses.proofImage}\`\`\``
                    }
                );

            // ActionRow with staff buttons to either approve or reject the user application.
            const staffApplicationActionRow = new ActionRowBuilder()
                .addComponents(laezClubApplyApproveButtonBuilder, laezClubApplyRejectButtonBuilder);


            // Get the channel object where to send the application message.
            const inboxChannel = interaction.guild.channels.cache.get(inboxChannelID);
            // Throw exception if channel is not found.
            if (!inboxChannel) throw new Error(`inboxChannel variable returns undefined which means this channel ID '${inboxChannelID}' is either invalid or has been removed from this guild.`);
            // Send message with the embed and button components to accept or reject the application.
            await inboxChannel.send({ embeds: [applicationEmbed], components: [staffApplicationActionRow] });

            // Send a reply message confirming that the form has been submitted successfully.
            await interaction.reply({ content: '**You submitted application to the club!**\nNow you need to wait for a staff member to either approve or reject your request.', ephemeral: true });

        } catch (error) { // Catch any potential errors.
            log.bug('[laezClubApplyModal] Error to execute this modal:', error);
        }
    }
};