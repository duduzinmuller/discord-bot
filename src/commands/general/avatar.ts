import { Command } from "../../types/Command.js";

const command: Command = {
  data: {
    name: "avatar",
    description: "Mostra o avatar de um usuário.",
    aliases: [],
    category: "utilidade",
    usage: "[@usuário]",
  },

  execute: async (message: any, args: string[]) => {
    const user = message.mentions.users.first() || message.author;

    return message.reply({
      embeds: [
        {
          title: `🖼️ Avatar de ${user.username}`,
          image: { url: user.displayAvatarURL({ size: 1024, dynamic: true }) },
          color: 0x3498db,
        },
      ],
    });
  },
};

export default command;
