const { SlashCommandBuilder } = require('@discordjs/builders');
const log = require('../../../../Addons/Logger');

module.exports = {
    enabled: false,
    guild: 'LAEZARIA',
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About laezaria'),

    async execute(client, interaction) {
        const { user, guild } = interaction;

        // Log who used the command.
        log.info(`[/ABOUT] Command used by '${user?.tag}' on the ${guild?.name ? `'${guild.name}' guild.` : 'direct message.'}`);

        try {
            // Create reply to defer the command execution.
            const reply = await interaction.reply({ content: 'Preparing reseponse...', ephemeral: true });


            // Edit the reply to indicate success.
            await reply.edit({ content: '**Laezaria** has been founded in 2015 by @Trovegasm and has been one of the most popular high-end / end-game clubs, peaking after the Mantle of Power update. We have always been an active and friendly community.' });
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
