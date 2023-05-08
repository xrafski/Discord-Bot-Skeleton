/* eslint-disable quotes */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const { GuildNames } = require('../../../Addons/GuildNames');
const log = require('../../../Addons/Logger');
const { addCreateClubButtonMenu } = require('../../Menus/createClubButtonMenu');
const { EmojiEnums } = require('../../../Addons/Enums');

module.exports = {
    enabled: true,
    guild: GuildNames.TEA,
    data: new SlashCommandBuilder()
        .setName('component')
        .setDescription('This interaction gives you the ability to add components buttons to your guild')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        // Set the commandGroup for creating the interaction for guild.
        .addSubcommandGroup((group) =>
            group
                .setName('create')
                .setDescription('Creates a new components')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('application_button')
                        .setDescription("Creates a component button with application system for followed club.")
                        .addStringOption(option =>
                            option
                                .setName('channel-id')
                                .setDescription('Channel ID for the component to create')
                                .setRequired(true)
                        )
                ),
        ),

    async execute(interaction, args) {
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/COMPONENT] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        try {
            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: `${EmojiEnums.LOADING} Preparing reseponse...`, ephemeral: true });
            const [subCmdGroup, subCmd, channelID] = args; // Destructuring assignment

            // Check if channel ID is a number
            if (!Number.isInteger(Number(channelID))) {
                return await reply.edit({ content: 'Your channel ID is not a valid number.' }); // CHANGEME: Make this string to also tell the user how to get the channel ID properly.
            }

            // Get the channel object from its ID.
            const tChannel = await interaction.client.channels.cache.get(channelID);

            // Check if tChannel is an object.
            if (!tChannel) return await reply.edit({ content: 'Channel with provided ID is not found.' });


            // Laezaria Add Application Button.
            if (subCmdGroup === 'create' && subCmd === 'application_button') {
                return addCreateClubButtonMenu(interaction, `${EmojiEnums.LOADING} Select components to post in ${tChannel}!`);
            }

            // Edit the reply to indicate success.
            await reply.edit({ content: '✅ Your response is handled correctly.' });
        } catch (error) {
            log.bug('[/COMPONENT] Interaction error:', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((editError) => log.bug('[/COMPONENT] Error editing interaction reply:', editError));
        }
    },
};
