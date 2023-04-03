const { ActionRowBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const log = require('../../../Addons/Logger');
const { ButtonBuilder } = require('discord.js');
const { ButtonStyle } = require('discord.js');
module.exports = {
    enabled: true,
    category: 'GUILD',
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('A command with a message component button.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction) {
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/BUTTON] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        try {
            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: 'Generating response...', ephemeral: true });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exampleButton')
                        .setLabel('Click me!')
                        .setStyle(ButtonStyle.Primary),
                );

            if (!interaction.channel) {
                throw new Error('Interaction channel is undefined.');
            }


            // Send channel message.
            await interaction.channel.send({ content: 'Hello, world!', components: [row] });

            // Edit the reply to indicate success.
            await reply.edit({ content: '✅ Your message has been sent correctly.' });
        } catch (error) {
            log.bug(`[/BUTTON] Command error: ${error}`);
            interaction.editReply({ content: `🥶 Something went wrong with the command.\n> ${error?.message}`, ephemeral: true })
                .catch((editError) => log.bug(`[/BUTTON] Error editing interaction reply: ${editError}`));
        }
    },
};
