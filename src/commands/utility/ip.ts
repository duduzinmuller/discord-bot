import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";
import axios from "axios";

const command: Command = {
  data: {
    name: "ip",
    description: "Retorna a geolocalização aproximada de um IP.",
    aliases: [],
    category: "utilidade",
    usage: "<endereço IP>",
  },

  execute: async (message, args) => {
    const ip = args[0];
    if (!ip) {
      return message.reply({
        embeds: [
          createErrorEmbed("Erro", "Você precisa informar um endereço IP!"),
        ],
      });
    }

    try {
      const { data }: any = await axios.get(`http://ip-api.com/json/${ip}`);
      if (data.status !== "success") throw new Error();

      const embed = createEmbed({
        title: "🌍 Geolocalização IP",
        description: `**IP:** ${data.query}\n**País:** ${data.country}\n**Cidade:** ${data.city}\n**Região:** ${data.regionName}\n**Provedor:** ${data.isp}\n**Latitude:** ${data.lat}\n**Longitude:** ${data.lon}`,
        color: Colors.INFO as ColorResolvable,
      });

      message.reply({ embeds: [embed] });
    } catch {
      message.reply({
        embeds: [createErrorEmbed("Erro", "Não foi possível localizar o IP.")],
      });
    }
  },
};

export default command;
