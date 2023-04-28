/**
 * Finds an emoji object with a given name on a specific guild object.
 * @param {object} client - The client object.
 * @param {string} emojiName - The name of the emoji to find on TEA server.
 * @returns {string} The string representation of the emoji or '🐛' if not found.
 */
function findEmoji(client, emojiName) {
    const guild = client.guilds.cache.get(process.env.TEA_GUILD_ID);
    const emoji = guild.emojis.cache.find(e => e.name === emojiName); // find the emoji by name

    if (emoji) {
        return emoji.toString();
    } else {
        return '🐛';
    }
}

module.exports = findEmoji;