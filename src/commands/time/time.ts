import { Message } from 'discord.js';
import { Command } from '../../types/Command.js';
import { createEmbed, Colors } from '../../utils/embeds.js';
import moment from 'moment-timezone';
import { ColorResolvable } from 'discord.js';

const command: Command = {
  data: {
    name: 'hora',
    description: 'Mostra a hora atual em um fuso horário específico',
    aliases: ['time', 'horario'],
    category: 'tempo',
    usage: '[fuso horário]'
  },
  
  execute: async (message: Message, args: string[]) => {
    let timezone = 'America/Sao_Paulo';
    
    if (args.length > 0) {
      const requestedTimezone = args.join(' ');
      const validTimezones = moment.tz.names();
      
      const matchingTimezone = validTimezones.find(tz => 
        tz.toLowerCase() === requestedTimezone.toLowerCase()
      );
      
      if (matchingTimezone) {
        timezone = matchingTimezone;
      } else {
        const possibleMatches = validTimezones.filter(tz => 
          tz.toLowerCase().includes(requestedTimezone.toLowerCase())
        );
        
        if (possibleMatches.length > 0) {
          timezone = possibleMatches[0];
        } else {
          return message.reply({
            embeds: [
              createEmbed({
                title: '⚠️ Fuso Horário Inválido',
                description: `"${requestedTimezone}" não é um fuso horário válido. Tente usar um formato continente/cidade como "America/Sao_Paulo" ou "Europe/London".`,
                color: Colors.WARNING as ColorResolvable,
                timestamp: true
              })
            ]
          });
        }
      }
    }
    
    const time = moment().tz(timezone);
    const formattedTime = time.format('dddd, D [de] MMMM [de] YYYY, HH:mm:ss');
    const abbreviation = time.format('z');
    
    const embed = createEmbed({
      title: `🕒 Hora Atual: ${timezone}`,
      description: `${formattedTime} (${abbreviation})`,
      color: 0x3498db,
      fields: [
        {
          name: 'Data',
          value: time.format('DD/MM/YYYY'),
          inline: true
        },
        {
          name: 'Hora',
          value: time.format('HH:mm:ss'),
          inline: true
        },
        {
          name: 'Diferença UTC',
          value: time.format('Z'),
          inline: true
        }
      ],
      footer: { text: `Solicitado por ${message.author.tag}` },
      timestamp: true
    });
    
    await message.reply({ embeds: [embed] });
  }
};

export default command;