import { Command } from "../../types/Command.js";

const command: Command = {
  data: {
    name: "serverinfo",
    description: "Mostra informações do servidor.",
    aliases: ["guildinfo"],
    category: "utilidade",
    usage: "",
  },

  execute: async (message: any) => {
    const { guild } = message;

    const embed = {
      title: `📊 Informações do Servidor`,
      color: 0x7289da,
      fields: [
        { name: "📛 Nome", value: guild.name, inline: true },
        { name: "🆔 ID", value: guild.id, inline: true },
        { name: "👑 Dono", value: `<@${guild.ownerId}>`, inline: true },
        { name: "👥 Membros", value: `${guild.memberCount}`, inline: true },
        {
          name: "📅 Criado em",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        { name: "🛠️ Cargos", value: `${guild.roles.cache.size}`, inline: true },
        { name: "🌍 Região", value: `${guild.preferredLocale}`, inline: true },
      ],
      thumbnail: { url: guild.iconURL({ dynamic: true }) },
    };

    return message.reply({ embeds: [embed] });
  },
};

export default command;
