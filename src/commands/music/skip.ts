import { Message, GuildMember } from 'discord.js';
import { Command } from '../../types/Command.js';
import { createEmbed, Colors, createErrorEmbed } from '../../utils/embeds.js';
import { getVoiceConnection } from '@discordjs/voice';
import { getQueue } from '../../utils/musicManager.js';

const command: Command = {
  data: {
    name: 'pular',
    description: 'Pula a música atual',
    aliases: ['skip', 'next', 's'],
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
    
    if (!queue || queue.songs.length === 0) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            'Fila Vazia',
            'Não há músicas na fila!'
          )
        ]
      });
    }
    const currentSong = queue.songs[0];
    const player = (connection.state as any).subscription?.player;
    
    if (player) {
      player.stop();
      return message.reply({
        embeds: [
          createEmbed({
            title: '⏭️ Música Pulada',
            description: `Pulou [${currentSong.title}](${currentSong.url})`,
            color: '#2B2D31',
            timestamp: true
          })
        ]
      });
    } else {
      return message.reply({
        embeds: [
          createErrorEmbed(
            'Erro no Player',
            'Não foi possível pular a música atual. Tente novamente.'
          )
        ]
      });
    }
  }
};

export default command;