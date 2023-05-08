const log = require('./Logger');

/**
 * Class representing an error handler for Discord interactions.
 */
class InteractionError {
    /**
     * Create an error handler instance.
     * @param {Discord.Interaction} interaction - The Discord interaction object.
     * @param {string} fileName - The name of the file where the error occurred.
     */
    constructor(interaction, fileName) {
        this.interaction = interaction;
        this.fileName = fileName;
    }

    /**
     * Report the issue to the user and log it.
     * @async
     * @param {Error} error - The error object to report.
     * @returns {Promise<void>}
     */
    async issue(error) {
        try {
            // Log the error to the console.
            log.bug(`[${this.fileName}] Interaction error:`, error);

            // Check if interaction is already replied and respond accordingly.
            if (this.interaction.replied) {
                await this.interaction.editReply({
                    content: '🥶 Something went wrong with this interaction.\nPlease try again later.'
                });
            } else { // Otherwise just send the interaction reply.
                await this.interaction.reply({
                    content: '🥶 Something went wrong with this interaction.\nPlease try again later.',
                    ephemeral: true,
                });
            }

        } catch (responseError) {
            log.bug(`[${this.fileName}] Interaction error reply:`, responseError);
        }
    }
}

module.exports = {
    InteractionError
};