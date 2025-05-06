import { ColorResolvable, Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors, createErrorEmbed } from "../../utils/embeds.js";
import axios from "axios";

const command: Command = {
  data: {
    name: "gif",
    description: "Busca um GIF no Tenor",
    aliases: ["giphy"],
    category: "diversao",
    usage: "<termo de busca>",
  },

  execute: async (message: Message, args: string[]) => {
    if (args.length === 0) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Termo de Busca Faltando",
            `Por favor, especifique o que você quer buscar! Exemplo: \`${message.client.prefix}gif gato\``
          ),
        ],
      });
    }

    const searchTerm = args.join(" ");
    const apiKey = process.env.TENOR_API_KEY;

    try {
      const response: any = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
          searchTerm
        )}&key=${apiKey}&limit=10`
      );

      const randomGif =
        response.data.results[
          Math.floor(Math.random() * response.data.results.length)
        ];

      const embed = createEmbed({
        title: "🎬 GIF",
        description: `Resultado para: "${searchTerm}"`,
        color: Colors.MUSIC as ColorResolvable,
        image: randomGif.media_formats.gif.url,
        footer: { text: `Solicitado por ${message.author.tag}` },
        timestamp: true,
      });

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro ao buscar GIF:", error);

      await message.reply({
        embeds: [
          createErrorEmbed(
            "Erro",
            "Não foi possível buscar o GIF. Tente novamente mais tarde."
          ),
        ],
      });
    }
  },
};

export default command;
