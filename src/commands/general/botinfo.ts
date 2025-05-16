import os from "os";
import ms from "ms";
import { Command } from "../../types/Command.js";

const command: Command = {
  data: {
    name: "botinfo",
    description: "Mostra informações sobre o bot.",
    aliases: ["about"],
    category: "utilidade",
    usage: "",
  },

  execute: async (message: any) => {
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;
    const uptime = ms(message.client.uptime || 0, { long: true });

    const embed = {
      title: "🤖 Informações do Bot",
      color: 0xe67e22,
      fields: [
        {
          name: "📡 Latência",
          value: `${message.client.ws.ping}ms`,
          inline: true,
        },
        { name: "⏱️ Uptime", value: uptime, inline: true },
        { name: "💾 Memória", value: `${memory.toFixed(2)} MB`, inline: true },
        { name: "📚 Node.js", value: process.version, inline: true },
        { name: "🧠 Plataforma", value: os.platform(), inline: true },
      ],
      footer: {
        text: `Bot rodando com ${message.client.users.cache.size} usuários em ${message.client.guilds.cache.size} servidores.`,
      },
    };

    return message.reply({ embeds: [embed] });
  },
};

export default command;
