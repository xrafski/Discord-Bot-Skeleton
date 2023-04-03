const log = require('../Addons/Logger');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {

        // Application interaction command handler.
        if (interaction.isCommand()) {

            try {
                // Assing variable to a command.
                const command = client.commands.get(interaction.commandName);

                // Check if command exist.
                if (!client.commands.get(interaction.commandName)) return interaction.reply({ content: '⛔ It seems that this command is not valid and cannot be executed.\nTry again later...', ephemeral: true });

                // Create args array
                const args = [];

                // Loop through interaction.options.data to get arguments into args array
                for (const option of interaction.options.data) {

                    switch (option.type) {

                        // When command has a group option.
                        case 'SUB_COMMAND_GROUP': {

                            // Get group name
                            if (option.name) args.push(option.name);

                            // Get sub command name
                            if (option.options[0].name) args.push(option.options[0].name);

                            // Get sub command arguments
                            option.options[0]?.options.forEach((x) => {
                                if (x.value) args.push(x.value);
                            });

                            break;
                        }

                        // When command has a sub command option.
                        case 'SUB_COMMAND': {

                            // Get sub command name
                            if (option.name) args.push(option.name);

                            // Get sub command arguments
                            option.options?.forEach((x) => {
                                if (x.value) args.push(x.value);
                            });

                            break;
                        }

                        // When main command has arguments.
                        default: {
                            // Get option value
                            args.push(option.value);
                            break;
                        }
                    }

                }

                // Execute the command.
                command.execute(client, interaction, args);
            } catch (error) {
                log.bug('Error with interactionCreate event', error);
                return interaction.reply({ content: '🐛 An error occurred while executing the command!', ephemeral: true }).catch(err => log.bug('Error to send interaction response', err));
            }
        }

        if (interaction.isButton()) {
            {

                try {
                    // Assing variable to a command.
                    const button = client.buttons.get(interaction.customId);

                    // Check if command exist.
                    if (!client.buttons.get(interaction.customId)) {
                        log.bug('Non supported interaction button used:', interaction.customId);
                        return interaction.reply({ content: '🐛 It seems that this button is not valid and cannot be executed.\nTry again later...', ephemeral: true });
                    }

                    // Execute the command.
                    button.execute(client, interaction);
                } catch (error) {
                    log.bug('Error with interactionCreate event', error);
                    return interaction.reply({ content: '🐛 An error occurred while executing the button!', ephemeral: true })
                        .catch(err => log.bug('Error to send interaction response', err));
                }
            }
        }
    },
};