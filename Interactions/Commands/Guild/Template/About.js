const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildNames } = require('../../../../Addons/GuildNames');
const log = require('../../../../Addons/Logger');
const findEmoji = require('../../../../Addons/findEmoji');

module.exports = {
    enabled: false,
    guild: GuildNames.template,
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About template club'),

    async execute(interaction) {
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/ABOUT] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        try {
            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: `${findEmoji(interaction.client, 'loading')} Preparing reseponse...`, ephemeral: true });

            // Edit the reply to indicate success.
            await reply.edit({ content: '**Template** example information command' });
        } catch (error) {
            log.bug('[/ABOUT] Interaction error:', error);

            // Send an error message to the user.
            await interaction.editReply({
                content: '🥶 Something went wrong with this interaction. Please try again later.',
                ephemeral: true
            }).catch((editError) => log.bug(`[/ABOUT] Error editing interaction reply: ${editError}`));
        }
    },
};
