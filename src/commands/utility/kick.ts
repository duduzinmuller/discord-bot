import { ColorResolvable, Message, GuildMember } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "kick",
    description: "Expulsa um usuário do servidor.",
    aliases: [],
    category: "moderação",
    usage: "<@usuário> [motivo]",
  },

  execute: async (message: Message, args: string[]) => {
    if (!message.member?.permissions.has("KickMembers")) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Permissão Negada",
            "Você não tem permissão para expulsar membros."
          ),
        ],
      });
    }

    const member = message.mentions.members?.first();
    const motivo = args.slice(1).join(" ") || "Nenhum motivo fornecido.";

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

    if (!member.kickable) {
      return message.reply({
        embeds: [
          createErrorEmbed("Erro", "Não consigo expulsar este usuário."),
        ],
      });
    }

    await member.kick(motivo);

    return message.reply({
      embeds: [
        createEmbed({
          title: "👢 Usuário Expulso",
          description: `${member.user.tag} foi expulso.\n**Motivo:** ${motivo}`,
          color: Colors.SUCCESS as ColorResolvable,
          timestamp: true,
          footer: { text: `Solicitado por ${message.author.tag}` },
        }),
      ],
    });
  },
};

export default command;
