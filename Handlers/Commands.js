const { glob } = require('glob');
const path = require('path');
const AsciiTable = require('ascii-table');
const { Collection, REST, Routes } = require('discord.js');
const log = require('../Addons/Logger');

/**
 * Array of guild application interactions.
 * @use for registerGuildCmds().
 */
const guildCmds = []; // Guild application interactions commands.

/**
 * Array of global application interactions.
 * @use for registerGlobalCmds().
 */
const globalCmds = []; // Global application interactions commands.

/**
 * Loads application interaction command handler.
 * @param {Discord.Client} client - The Discord.js client instance.
 * @returns {Promise<string>} - A promise that resolves with a table of loaded commands as a string, or rejects with an error message.
 * @example await loadAppCmds(client).then(function).catch(error);
 */
const loadAppCmds = (client) =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve, reject) => {
        log.debug('[LOAD COMMANDS] Started loading application interaction command handler.');

        // Create a new table.
        const table = new AsciiTable('Application Interaction Commands');
        table.setHeading('Status', 'Category', 'Name', 'File');

        // Application interaction collection.
        client.commands = new Collection();

        try {
            // Load application interaction slash commands files.
            const appCmdFiles = await glob('Interactions/Commands/**/*.js');

            for (const file of appCmdFiles) {
                try {
                    // Get full path to the command file.
                    const cmd_dir_root = path.join(process.cwd(), file);

                    // Assign variable to a command file.
                    const slashCommand = require(cmd_dir_root);

                    // Check if command has name.
                    if (!slashCommand.data?.name) {
                        continue;
                    }

                    // Add table row for this command.
                    table.addRow(
                        slashCommand.enabled ? 'ENABLED' : 'DISABLED',
                        slashCommand.category,
                        slashCommand.data.name,
                        file.split('/').slice(-1).join('/')
                    );

                    // Check if command is disabled.
                    if (!slashCommand.enabled) {
                        continue;
                    }

                    // Set command into slashCommands collector.
                    client.commands.set(slashCommand.data.name, slashCommand);

                    // Log command being loaded.
                    log.debug(`[LOAD COMMANDS] Loaded '${slashCommand.data.name}' application interaction command.`);

                    // Finally split slashCommands into separate categories.
                    switch (slashCommand.category) {
                        case 'GLOBAL':
                            globalCmds.push(slashCommand.data.toJSON());
                            break;
                        case 'GUILD':
                            guildCmds.push(slashCommand.data.toJSON());
                            break;
                        default:
                            reject(`Command '${slashCommand.data.name}' has unhandled category '${slashCommand.category}'!`);
                            break;
                    }
                } catch (error) {
                    reject(`Error loading application interaction command file '${file}': ${error.message}`);
                }
            }

            // Send a log when there are no commands loaded.
            if (client.commands.size === 0) {
                resolve('[LOAD COMMANDS] No application interactions commands were found or enabled.');
            } else {
                resolve(table.toString());
            }
        } catch (error) {
            reject(`Error loading application interaction command files: ${error.message}`);
        }
    });

// Create rest variable for application slash command registry.
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_APP_TOKEN);

/**
 * Refreshes guild interaction commands.
 * @param {Array} commands - An array of guild interaction commands to be registered.
 * @returns {Promise} - A promise that resolves with a success message, or rejects with an error message.
 * @example await registerGuildCmds(cmds).then(function).catch(error);
 */
const registerGuildCmds = commands =>
    new Promise((resolve, reject) => {
        log.debug('[REGISTER GUILD INTERACTION COMMANDS] Started refreshing guild application interaction commands.');

        (async () => {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, process.env.SERVER_ID),
                    { body: commands }
                );

                resolve('✅ Successfully refreshed GUILD application interaction commands.', commands);
            } catch (err) {
                reject(`Error to refresh guild application interaction commands: ${err.message}`);
            }
        })();
    });


/**
 * Refreshes global interaction commands.
 * @param {Array} commands - An array of global interaction commands to be registered.
 * @returns {Promise} - A promise that resolves with a success message, or rejects with an error message.
* @example await registerGlobalCmds().then(function).catch(error);
*/
const registerGlobalCmds = commands =>
    new Promise((resolve, reject) => {
        log.debug('[REGISTER GLOBAL INTERACTION COMMANDS] Started refreshing global application interaction commands.');

        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(process.env.DISCORD_APP_ID),
                    { body: commands }
                );

                resolve('✅ Successfully refreshed GLOBAL application interaction commands.', commands);
            } catch (err) {
                reject(`Error to refresh global application interaction commands: ${err.message}`);
            }
        })();
    });


module.exports = { loadAppCmds, registerGuildCmds, registerGlobalCmds, guildCmds, globalCmds };
