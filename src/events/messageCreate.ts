import { Events, Message } from 'discord.js';
import { logger } from '../utils/logger.js';
import { createErrorEmbed } from '../utils/embeds.js';

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    // Ignore messages from bots
    if (message.author.bot) return;
    
    // Get client from the message
    const client = message.client;
    
    // Check for prefix
    if (!message.content.startsWith(client.prefix)) return;
    
    // Parse command and arguments
    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandName) return;
    
    // Find the command by name or alias
    const command = client.commands.get(commandName) || 
                    [...client.commands.values()].find(cmd => 
                      cmd.data.aliases && cmd.data.aliases.includes(commandName)
                    );
    
    if (!command) return;
    
    // Execute the command
    try {
      logger.debug(`Executing command: ${commandName}`);
      await command.execute(message, args);
    } catch (error) {
      logger.error(`Error executing command ${commandName}:`, error);
      const errorEmbed = createErrorEmbed(
        'Command Error',
        'There was an error executing that command!'
      );
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};