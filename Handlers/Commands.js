const { glob } = require('glob');
const path = require('path');
const AsciiTable = require('ascii-table');
const { Collection, REST, Routes } = require('discord.js');
const log = require('../Addons/Logger');
const { GuildNames } = require('../Addons/GuildNames');

/**
 * Object with arrays of application interactions commands.
 * @use for registerGuildCmds().
 */
const appCommands = {}; // Object with interaction commands arrays.

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
        table.setHeading('Status', 'Guild', 'Name', 'File');

        function tableAddRow(slashCommand, file) {
            // Add table row for this command.
            table.addRow(
                slashCommand.enabled ? 'ENABLED' : 'DISABLED',
                slashCommand.guild,
                slashCommand.data.name,
                file.split('/').slice(-1).join('/')
            );
        }

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

                    // Check if command is disabled.
                    if (!slashCommand.enabled) {
                        continue;
                    }

                    // Set command into slashCommands collector.
                    client.commands.set(slashCommand.data.name, slashCommand);

                    // Log command being loaded.
                    log.debug(`[LOAD COMMANDS] Loaded '${slashCommand.data.name}' application interaction command.`);

                    // Finally split slashCommands into separate categories.
                    switch (slashCommand.guild) {
                        case GuildNames.GLOBAL: {
                            appCommands.global = [slashCommand.data.toJSON()];
                            tableAddRow(slashCommand, file);
                            break;
                        }
                        case GuildNames.TEA: {
                            appCommands.TEA = [slashCommand.data.toJSON()];
                            tableAddRow(slashCommand, file);
                            break;
                        }
                        case GuildNames.TEST: {
                            appCommands.TEST = [slashCommand.data.toJSON()];
                            tableAddRow(slashCommand, file);
                            break;
                        }
                        default:
                            log.warn(`Command '${slashCommand.data.name}' has unhandled guild parameter set:`, `'${slashCommand?.guild}' and is not loaded`);
                            // Add table row for this invalid command.
                            table.addRow(
                                'INVALID',
                                slashCommand?.guild,
                                slashCommand.data.name,
                                file.split('/').slice(-1).join('/')
                            );
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

        log.debug('🆗 [LOAD COMMANDS] Finished loading application interaction command handler.');
    });

// Create rest variable for application slash command registry.
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_APP_TOKEN);

/**
 * Refreshes guild interaction commands.
 * @param {Array} commands - An array of guild interaction commands to be registered.
 * @param {String} guildID - String with the guild ID.
 * @param {String} friendlyName - String with the name of the guild to easy recognition.
 * @returns {Promise} - A promise that resolves with a success message, or rejects with an error message.
 * @example await registerGuildCmds(cmds, '1234567890', 'some club name').then(function).catch(error);
 */
async function registerGuildCmds(commands, guildID, friendlyName) {
    return new Promise((resolve, reject) => {
        log.debug(`[REGISTER GUILD COMMANDS] Started refreshing '${friendlyName}' specific application guild commands.`);

        setTimeout(async () => { // 5 seconds timeout for each command registry API request.
            try {
                if (!guildID || !friendlyName) throw new Error('Missing required parameters to register specific application guild commands.');
                await rest.put(
                    Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, guildID),
                    { body: commands ? commands : [] }
                );

                resolve(`[REGISTER GUILD COMMANDS] Successfully refreshed '${friendlyName}' specific application guild commands.`, commands);
            } catch (err) {
                reject(`[REGISTER GUILD COMMANDS] Error to refresh '${friendlyName}' specific application guild commands: ${err.message}`);
            }
        }, 5000);
    });
}


/**
 * Refreshes global interaction commands.
 * @param {Array} commands - An array of global interaction commands to be registered.
 * @returns {Promise} - A promise that resolves with a success message, or rejects with an error message.
* @example await registerGlobalCmds().then(function).catch(error);
*/
const registerGlobalCmds = commands =>
    new Promise((resolve, reject) => {
        log.debug('[REGISTER GLOBAL COMMANDS] Started refreshing global application commands.');

        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(process.env.DISCORD_APP_ID),
                    { body: commands ? commands : [] }
                );

                resolve('[REGISTER GLOBAL COMMANDS] ✅ Successfully refreshed GLOBAL application commands.', commands);
            } catch (err) {
                reject(`[REGISTER GLOBAL COMMANDS] Error to refresh global application commands: ${err.message}`);
            }
        })();
    });


module.exports = { loadAppCmds, registerGuildCmds, registerGlobalCmds, appCommands };
