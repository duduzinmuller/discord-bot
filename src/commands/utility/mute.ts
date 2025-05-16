import { ColorResolvable, Message, GuildMember } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";

const parseDuration = (str: string): number | null => {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
};

const command: Command = {
  data: {
    name: "mute",
    description: "Silencia um usuário por um tempo.",
    aliases: [],
    category: "moderação",
    usage: "<@usuário> <tempo> (ex: 10m, 1h)",
  },

  execute: async (message: Message, args: string[]) => {
    if (!message.member?.permissions.has("ModerateMembers")) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Permissão Negada",
            "Você não tem permissão para silenciar membros."
          ),
        ],
      });
    }

    const member = message.mentions.members?.first();
    const tempo = args[1];

    if (!member || !tempo) {
      return message.reply({
        embeds: [
          createErrorEmbed("Uso Incorreto", "Uso correto: `mute @usuário 10m`"),
        ],
      });
    }

    const duration = parseDuration(tempo);
    if (!duration) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Tempo Inválido",
            "Use formatos como 10s, 5m, 1h, 1d"
          ),
        ],
      });
    }

    await member.timeout(duration);

    return message.reply({
      embeds: [
        createEmbed({
          title: "🔇 Usuário Silenciado",
          description: `${member.user.tag} foi silenciado por ${tempo}.`,
          color: Colors.WARNING as ColorResolvable,
          timestamp: true,
          footer: { text: `Solicitado por ${message.author.tag}` },
        }),
      ],
    });
  },
};

export default command;
