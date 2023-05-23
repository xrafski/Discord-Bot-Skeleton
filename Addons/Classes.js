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

            // Handle Axios Error.
            if (error.name === 'AxiosError') {
                return await sendInteractionResponse(this.interaction, 'API', error.message);
            } else { // Handle default error.
                await sendInteractionResponse(this.interaction, 'this interaction', error.message);
            }

        } catch (responseError) {
            log.bug(`[${this.fileName}] InteractionError Class Error:`, responseError);
        }
    }
}

/**
 * Send an interaction response with an error message.
 * @async
 * @param {Discord.Interaction} interaction - The Discord interaction object.
 * @param {string} thing - The description of the thing that encountered an error.
 * @param {string} errMsg - The error message to display (optional).
 * @returns {Promise<void>}
 */
async function sendInteractionResponse(interaction, thing, errMsg) {
    // Check if interaction is already replied and respond accordingly.
    if (interaction.replied) {
        await interaction.editReply({
            content: `🥶 Something went wrong with ${thing}.${errMsg ? `\n> ${errMsg}` : ''}\nPlease try again later.`
        });
    } else { // Otherwise just send the interaction reply.
        await interaction.reply({
            content: `🥶 Something went wrong with ${thing}.${errMsg ? `\n> ${errMsg}` : ''}\nPlease try again later.`,
            ephemeral: true,
        });
    }
}

module.exports = {
    InteractionError
};