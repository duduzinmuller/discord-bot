import { Message, GuildMember } from 'discord.js';
import { Command } from '../../types/Command.js';
import { createEmbed, Colors, createErrorEmbed } from '../../utils/embeds.js';
import { getVoiceConnection } from '@discordjs/voice';
import { getQueue, clearQueue } from '../../utils/musicManager.js';

const command: Command = {
  data: {
    name: 'parar',
    description: 'Para a música e limpa a fila',
    aliases: ['stop', 'leave', 'sair'],
    category: 'musica'
  },
  
  execute: async (message: Message) => {
    const member = message.member as GuildMember;
    if (!member.voice.channel) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            'Canal de Voz Necessário',
            'Você precisa estar em um canal de voz para usar este comando!'
          )
        ]
      });
    }
    
    if (!message.guild) return;
    const connection = getVoiceConnection(message.guild.id);
    
    if (!connection) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            'Não Está Tocando',
            'Não estou tocando nenhuma música no momento!'
          )
        ]
      });
    }
    
    const botVoiceChannel = message.guild.members.me?.voice.channelId;
    if (botVoiceChannel && member.voice.channelId !== botVoiceChannel) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            'Canal de Voz Incorreto',
            'Você precisa estar no mesmo canal de voz que eu para usar este comando!'
          )
        ]
      });
    }
    
    const queue = getQueue(message.guild.id);
    
    clearQueue(message.guild.id);
    connection.destroy();
    
    const songsCount = queue ? queue.songs.length : 0;
    
    return message.reply({
      embeds: [
        createEmbed({
          title: '🛑 Música Parada',
          description: `Parei a reprodução e limpei a fila. Removidas ${songsCount} música(s).`,
          color: Colors.PRIMARY,
          timestamp: true
        })
      ]
    });
  }
};

export default command;