import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "ship",
    description: "Mostra a compatibilidade amorosa entre dois usuários.",
    aliases: ["casal", "amor"],
    category: "diversão",
    usage: "@pessoa1 @pessoa2",
  },

  execute: async (message: any, args: string[]) => {
    const mentions = message.mentions.users;

    if (mentions.size < 2) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Argumentos Faltando",
            `Você precisa mencionar duas pessoas! Exemplo: \`${message.client.prefix}ship @pessoa1 @pessoa2\``
          ),
        ],
      });
    }

    const users = mentions.map((user: any) => user);
    const user1 = users[0];
    const user2 = users[1];

    if (user1.id === user2.id) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Mencione Pessoas Diferentes",
            "Você não pode shippar a mesma pessoa com ela mesma 😅"
          ),
        ],
      });
    }

    const porcentagem = Math.floor(Math.random() * 101);
    const barra = "█".repeat(porcentagem / 10).padEnd(10, "░");

    let status = "";
    if (porcentagem >= 80) status = "💘 Alma gêmea!";
    else if (porcentagem >= 60) status = "💕 Um belo casal!";
    else if (porcentagem >= 40) status = "💞 Pode dar certo!";
    else if (porcentagem >= 20) status = "😅 Melhor como amigos.";
    else status = "💔 Incompatíveis!";

    return message.reply({
      embeds: [
        createEmbed({
          title: "💖 Compatibilidade Amorosa",
          description:
            `**${user1} + ${user2}**\n\n` +
            `💟 Compatibilidade: \`${porcentagem}%\` [${barra}]\n${status}`,
          color: Colors.PRIMARY as ColorResolvable,
        }),
      ],
    });
  },
};

export default command;
