import { CommandInteraction, Message } from 'discord.js';

export interface CommandData {
  name: string;
  description: string;
  aliases?: string[];
  category: string;
  usage?: string;
  cooldown?: number;
}

export interface Command {
  data: CommandData;
  execute: (message: Message, args: string[]) => Promise<any>;
}