import { Command } from "../../types/Command.js";

const command: Command = {
  data: {
    name: "userinfo",
    description: "Mostra informações de um usuário.",
    aliases: ["user"],
    category: "utilidade",
    usage: "[@usuário]",
  },

  execute: async (message: any) => {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    const embed = {
      title: `🔍 Informações de ${user.username}`,
      color: 0x9b59b6,
      thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
      fields: [
        { name: "🆔 ID", value: user.id, inline: true },
        {
          name: "📅 Conta criada",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: "📅 Entrou no servidor",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: "📜 Cargos",
          value:
            member.roles.cache
              .map((r: { name: any }) => r.name)
              .slice(1)
              .join(", ") || "Nenhum",
          inline: false,
        },
      ],
    };

    return message.reply({ embeds: [embed] });
  },
};

export default command;
