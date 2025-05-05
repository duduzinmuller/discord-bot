import { Events, Client } from 'discord.js';
import { logger } from '../utils/logger.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (!client.user) return;
    logger.info(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity('!help', { type: 0 });
  },
};