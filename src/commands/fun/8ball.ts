import { ColorResolvable, Message } from 'discord.js';
import { Command } from '../../types/Command.js';
import { createEmbed, Colors } from '../../utils/embeds.js';

const command: Command = {
  data: {
    name: '8ball',
    description: 'Pergunte algo para a bola 8 mágica',
    aliases: ['8b', 'sorte'],
    category: 'diversao',
    usage: '<pergunta>'
  },
  
  execute: async (message: Message, args: string[]) => {
    if (args.length === 0) {
      return message.reply({
        embeds: [
          createEmbed({
            title: '❓ Pergunta Faltando',
            description: `Você precisa fazer uma pergunta! Tente \`${message.client.prefix}8ball Vou ter um bom dia?\``,
            color: 'Yellow',
            timestamp: true
          })
        ]
      });
    }
    
    const question = args.join(' ');
    
    const responses = [
      'Com certeza!',
      'Definitivamente sim.',
      'Sem dúvida.',
      'Sim, com certeza.',
      'Pode contar com isso.',
      'Do jeito que eu vejo, sim.',
      'Provavelmente.',
      'As perspectivas são boas.',
      'Sim.',
      'Tudo indica que sim.',
      'Melhor não responder agora.',
      'Pergunte novamente mais tarde.',
      'Não posso prever agora.',
      'Concentre-se e pergunte novamente.',
      'Não conte com isso.',
      'Minha resposta é não.',
      'Minhas fontes dizem não.',
      'As perspectivas não são boas.',
      'Muito duvidoso.',
      'Absolutamente não.'
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    let color = Colors.PRIMARY;
    if (responses.indexOf(response) < 10) {
      color = Colors.SUCCESS; 
    } else if (responses.indexOf(response) >= 15) {
      color = Colors.ERROR;    
    } else {
      color = Colors.WARNING;  
    }
    
    const embed = createEmbed({
      title: '🎱 Bola 8 Mágica',
      description: `**Pergunta:** ${question}\n\n**Resposta:** ${response}`,
      color: color as ColorResolvable,
      thumbnail: 'https://i.imgur.com/44uuMmH.png',
      footer: { text: `Perguntado por ${message.author.tag}` },
      timestamp: true
    });
    
    await message.reply({ embeds: [embed] });
  }
};

export default command;