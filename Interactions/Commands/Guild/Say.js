const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const log = require('../../../Addons/Logger');
module.exports = {
    enabled: false,
    category: 'GUILD',
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say something using the bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
                .setName('text')
                .setDescription('Text to send (OPTIONAL)')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('attachment')
                .setDescription('URL to an image (OPTIONAL)')
                .setRequired(false)
        ),

    async execute(client, interaction, args) {
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/SAY] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        try {
            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: 'Sending message...', ephemeral: true });

            if (!interaction.channel) {
                throw new Error('Interaction channel is undefined.');
            }

            // Assign values to variables.
            const content = args[0] ?? null;

            // Send a joke empty message if no arguments are passed.
            if (!args.length) {
                await interaction.channel.send({
                    content: 'ㅤ',
                });
                return await reply.edit({ content: '✅ Your **EMPTY** message has been sent correctly 🙃' });
            }

            // Send a message with the attachment argument.
            if (args[1]) {
                // Send channel message with an attachment.
                await interaction.channel.send({
                    content,
                    files: [args[1]]
                });
                return await reply.edit({ content: '✅ Your message has been sent correctly.' });
            }

            // Send a message with just regular text content.
            await interaction.channel.send({
                content,
            });
            return await reply.edit({ content: '✅ Your message has been sent correctly.' });


        } catch (error) {
            log.bug('[/SAY] Interaction error:', error);

            // Send an error message to the user about missing permissions.
            if (error?.message === 'Missing Permissions') {
                await interaction.editReply({
                    content: `🥶 Something went wrong with this interaction.\nMake sure ${client.user} has 'Send Messages' and/or 'Attach Files' permission to perform this action.`,
                    ephemeral: true
                }).catch((editError) => log.bug(`[/SAY] Error editing interaction reply: ${editError}`));
            }

            // Default error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((editError) => log.bug(`[/SAY] Error editing interaction reply: ${editError}`));
        }
    },
};
