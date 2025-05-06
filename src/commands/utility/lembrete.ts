import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors, createErrorEmbed } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "lembrete",
    description:
      "Define um lembrete para ser enviado depois de um tempo específico",
    aliases: ["remind", "reminder"],
    category: "utilidade",
    usage: "<tempo em minutos> <mensagem>",
  },

  execute: async (message: any, args: string[]) => {
    if (args.length < 2) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Argumentos Insuficientes",
            `Use: \`${message.client.prefix}lembrete <minutos> <mensagem>\`\nExemplo: \`${message.client.prefix}lembrete 30 Fazer café\``
          ),
        ],
      });
    }

    const minutes = parseInt(args[0]);
    if (isNaN(minutes) || minutes <= 0 || minutes > 1440) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Tempo Inválido",
            "O tempo deve ser um número entre 1 e 1440 minutos (24 horas)."
          ),
        ],
      });
    }

    const reminderText = args.slice(1).join(" ");
    const ms = minutes * 60000;

    const embed = createEmbed({
      title: "⏰ Lembrete Definido",
      description: `Vou te lembrar sobre: **${reminderText}**\nEm: **${minutes} minutos**`,
      color: Colors.SUCCESS as ColorResolvable,
      footer: { text: `Solicitado por ${message.author.tag}` },
      timestamp: true,
    });

    await message.reply({ embeds: [embed] });

    setTimeout(async () => {
      const reminderEmbed = createEmbed({
        title: "⏰ Lembrete!",
        description: reminderText,
        color: Colors.MUSIC as ColorResolvable,
        footer: { text: `Lembrete definido há ${minutes} minutos` },
        timestamp: true,
      });

      await message.author.send({ embeds: [reminderEmbed] }).catch(() => {
        message.channel.send({
          content: `<@${message.author.id}>`,
          embeds: [reminderEmbed],
        });
      });
    }, ms);
  },
};

export default command;
