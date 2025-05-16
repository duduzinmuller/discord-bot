import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "limpar",
    description: "Apaga mensagens do chat.",
    aliases: ["clear", "apagar"],
    category: "moderação",
    usage: "<quantidade>",
  },

  execute: async (message: any, args: string[]) => {
    if (!message.member?.permissions.has("ManageMessages")) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Permissão Negada",
            "Você não tem permissão para apagar mensagens."
          ).toJSON(),
        ],
      });
    }

    const quantidade = parseInt(args[0], 10);

    if (isNaN(quantidade) || quantidade < 1 || quantidade > 100) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Uso Inválido",
            "Informe um número entre 1 e 100. Exemplo: `/limpar 10`"
          ).toJSON(),
        ],
      });
    }

    try {
      await message.channel.bulkDelete(quantidade, true);

      const confirmEmbed = createEmbed({
        title: "🧹 Limpeza Concluída",
        description: `${quantidade} mensagens foram apagadas.`,
        color: Colors.SUCCESS as ColorResolvable,
        timestamp: true,
        footer: { text: `Solicitado por ${message.author.tag}` },
      });

      const confirmation = await message.channel.send({
        embeds: [confirmEmbed.toJSON()],
      });

      setTimeout(() => confirmation.delete().catch(() => {}), 5000);
    } catch (error) {
      console.error("Erro ao limpar mensagens:", error);
      message.reply({
        embeds: [
          createErrorEmbed(
            "Erro",
            "Ocorreu um erro ao tentar apagar as mensagens."
          ).toJSON(),
        ],
      });
    }
  },
};

export default command;
