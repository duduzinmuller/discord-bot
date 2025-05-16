import { ColorResolvable, Message, GuildMember } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "unmute",
    description: "Remove o silêncio de um usuário.",
    aliases: [],
    category: "moderação",
    usage: "<@usuário>",
  },

  execute: async (message: Message, args: string[]) => {
    if (!message.member?.permissions.has("ModerateMembers")) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Permissão Negada",
            "Você não tem permissão para remover silêncio."
          ),
        ],
      });
    }

    const member = message.mentions.members?.first();

    if (!member) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Usuário Não Encontrado",
            "Mencione um usuário válido."
          ),
        ],
      });
    }

    if (!member.communicationDisabledUntilTimestamp) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Não Silenciado",
            "Esse usuário não está silenciado."
          ),
        ],
      });
    }

    await member.timeout(null);

    return message.reply({
      embeds: [
        createEmbed({
          title: "🔊 Silêncio Removido",
          description: `O usuário ${member.user.tag} não está mais silenciado.`,
          color: Colors.SUCCESS as ColorResolvable,
          timestamp: true,
          footer: { text: `Solicitado por ${message.author.tag}` },
        }),
      ],
    });
  },
};

export default command;
