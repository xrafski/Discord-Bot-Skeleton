const log = require('./Logger');

/**
 * Class representing an error handler for Discord interactions.
 */
class ErrorHandler {
    /**
     * Create an error handler instance.
     * @param {Discord.Interaction} interaction - The Discord interaction object.
     * @param {string} fileName - The name of the file where the error occurred.
     * @param {Error} error - The error object.
     */
    constructor(interaction, fileName, error) {
        this.interaction = interaction;
        this.fileName = fileName;
        this.error = error;
    }

    /**
     * Report the issue to the user and log it.
     * @async
     * @returns {Promise<void>}
     */
    async issue() {
        try {
            // Log the error to the console.
            log.bug(`[${this.fileName}] Interaction error:`, this.error);

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
    ErrorHandler
};