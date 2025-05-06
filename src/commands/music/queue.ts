import { ColorResolvable, Message } from 'discord.js';
import { Command } from '../../types/Command.js';
import { createEmbed, Colors, createErrorEmbed } from '../../utils/embeds.js';
import { getQueue } from '../../utils/musicManager.js';

const command: Command = {
  data: {
    name: 'fila',
    description: 'Mostra a fila de músicas',
    aliases: ['queue', 'q', 'lista'],
    category: 'musica'
  },
  
  execute: async (message: Message) => {
    if (!message.guild) return;
    
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
    
    const songList = queue.songs.map((song, index) => {
      const position = index === 0 ? 'Tocando Agora' : `${index}.`;
      const duration = formatDuration(song.duration);
      
      return `**${position}** [${song.title}](${song.url}) | \`${duration}\` | Pedido por: ${song.requestedBy}`;
    });
    
    const maxSongsPerPage = 10;
    const pages = [];
    
    for (let i = 0; i < songList.length; i += maxSongsPerPage) {
      pages.push(songList.slice(i, i + maxSongsPerPage));
    }
    
    const embed = createEmbed({
      title: '🎵 Fila de Músicas',
      description: pages[0].join('\n\n'),
      color: Colors.MUSIC as ColorResolvable,
      thumbnail: queue.songs[0].thumbnail || undefined,
      footer: {
        text: `Página 1/${pages.length} • ${queue.songs.length} música(s) na fila • Solicitado por ${message.author.tag}`
      },
      timestamp: true
    });
    
    if (pages.length === 1) {
      return message.reply({ embeds: [embed] });
    }
    
    let currentPage = 0;
    const queueMessage = await message.reply({ embeds: [embed] });
    
    await queueMessage.react('⬅️');
    await queueMessage.react('➡️');
  }
};

function formatDuration(seconds: number): string {
  if (!seconds) return 'Desconhecido';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default command;