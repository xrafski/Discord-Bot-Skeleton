/* eslint-disable quotes */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const { GuildNames } = require('../../../Addons/GuildNames');
const log = require('../../../Addons/Logger');
const { findEmoji } = require('../../../Addons/findEmoji');

module.exports = {
    enabled: true,
    guild: GuildNames.TEA,
    data: new SlashCommandBuilder()
        .setName('interaction')
        .setDescription('This interaction gives you the ability to add interaction buttons to your guild')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        // Set the commandGroup for creating the interaction for guild.
        .addSubcommandGroup((group) =>
            group
                .setName('create')
                .setDescription('Creates a new interaction for the specified guild')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('application_button')
                        .setDescription("Creates a interaction button with application system for followed club.")
                        .addStringOption(option =>
                            option
                                .setName('message-url')
                                .setDescription('Message URL for the interaction to create')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('club')
                                .setDescription('Pick a club name to create a coresponding button')
                                .addChoices(
                                    { name: 'Laezaria', value: 'laezaria' },
                                    { name: 'The North', value: 'thenorth' }
                                )
                                .setRequired(true),
                        )
                ),
        ),

    async execute(interaction, args) {
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/INTERACTION] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        try {
            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: `${findEmoji(interaction.client, 'loading')} Preparing reseponse...`, ephemeral: true });
            const [subCmdGroup, subCmd, messageURL, clubName] = args; // Destructuring assignment

            log.debug('Interaction received', interaction);
            log.debug('Destructuring assignment', { subCmdGroup, subCmd, messageURL, clubName });

            // https://canary.discord.com/channels/551785335638589451/840660313418366999/1103016674086637628
            // Check if IDarr has 3 elements (guildID, channelID, messageID)
            const IDarray = messageURL.split(/\/+/).slice(-3); // Split URL on '/' and slice last 3 elements (guildID, channelID, messageID)
            if (!(IDarray.length === 3)) return await reply.edit({ content: '❌ Provided message URL is not valid.' }); // Edit reply if message URL is not valid.

            //
            // Application button creation sub command logic.
            //

            // Laezaria Add Application Button.
            if (subCmdGroup === 'create' && subCmd === 'application_button' && clubName == 'laezaria') {
                return await reply.edit({ content: 'Add laez apply button called' });
            }



            // Edit the reply to indicate success.
            await reply.edit({ content: '✅ Your response is handled correctly.' });
        } catch (error) {
            log.bug('[/INTERACTION] Interaction error:', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((editError) => log.bug('[/INTERACTION] Error editing interaction reply:', editError));
        }
    },
};
