/**
 * Finds an emoji by name on a specific guild and returns its string representation.
 *
 * @param {import("discord.js").Client} client - The Discord client instance.
 * @param {string} emojiName - The name of the emoji to find.
 * @returns {string} The string representation of the emoji, or '🐛' if the emoji is not found.
 */
function findEmoji(client, emojiName) {
    const guild = client.guilds.cache.get(process.env.TEA_GUILD_ID); // get the guild object from the cache
    const emoji = guild.emojis.cache.find(e => e.name === emojiName); // find the emoji by name

    if (emoji) {
        return emoji.toString();
    } else {
        return '🐛';
    }
}

const emojiList = {
    loading: 'loading', // Animated loading emoji.
    approve: 'approve', // Approved things.
    reject: 'reject', // Rejected things.
    verify: 'verified', // To mention something that is verified.
};

const gifList = {
    gif1: 'https://cdn.discordapp.com/attachments/807269758243438632/1103034140087033876/75b2a1f7d2ca50d6c6a2e0408348e51bb7f9fb8a78d51fa708b8ee7eb9510e75.gif',
    gif2: 'https://cdn.discordapp.com/attachments/807269758243438632/1103034140493893694/87df29635b1fe1ccc3e29f3a1dc9c3052f013c908db152dc4b2ca8d2ca30e23f.gif',
    gif3: 'https://cdn.discordapp.com/attachments/807269758243438632/1103034140862988420/f7141678345f3fab9fba4ddb3b050a7e490bef925b9a0dd2c0db97b9760577e1.gif',
    gif4: 'https://cdn.discordapp.com/attachments/807269758243438632/1103034141211107388/bff1be4fe7224eb17a6ae2644584754d7dcd976d05b0201f99c103e1f9e7dd3a.gif',
    gif5: 'https://cdn.discordapp.com/attachments/807269758243438632/1103034141563441192/cf5ac91db32b4035e2cce668662cb38ddc117457f268f5d3594d682e3c344aba.gif',
    gif6: 'https://cdn.discordapp.com/attachments/807269758243438632/1103034141957701722/76361c95461cc1ca2a133e095a7928803de9a3e68167cc184c4c8d82b6c57edf.gif',
};

module.exports = {
    findEmoji,
    emojiList,
    gifList
};