import { ColorResolvable, Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "dado",
    description: "Rola um dado com o número de faces especificado",
    aliases: ["roll", "dice"],
    category: "diversao",
    usage: "[número de faces]",
  },

  execute: async (message: Message, args: string[]) => {
    let faces = 6;

    if (args.length > 0) {
      const requestedFaces = parseInt(args[0]);
      if (!isNaN(requestedFaces) && requestedFaces > 0) {
        faces = requestedFaces;
      }
    }

    const result = Math.floor(Math.random() * faces) + 1;

    const embed = createEmbed({
      title: "🎲 Rolagem de Dado",
      description: `Você rolou um d${faces} e tirou: **${result}**`,
      color: Colors.SUCCESS as ColorResolvable,
      footer: { text: `Solicitado por ${message.author.tag}` },
      timestamp: true,
    });

    await message.reply({ embeds: [embed] });
  },
};

export default command;
