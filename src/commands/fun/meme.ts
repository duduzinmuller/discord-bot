import { ColorResolvable, Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors, createErrorEmbed } from "../../utils/embeds.js";
import axios from "axios";

const command: Command = {
  data: {
    name: "meme",
    description: "Mostra um meme aleatório",
    aliases: ["memes"],
    category: "diversao",
  },

  execute: async (message: Message) => {
    try {
      const response: any = await axios.get("https://meme-api.com/gimme");

      const embed = createEmbed({
        title: "😂 Meme",
        description: response.data.title,
        color: Colors.MUSIC as ColorResolvable,
        image: response.data.url,
        footer: {
          text: `👍 ${response.data.ups} | Solicitado por ${message.author.tag}`,
        },
        timestamp: true,
      });

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro ao buscar meme:", error);

      await message.reply({
        embeds: [
          createErrorEmbed(
            "Erro",
            "Não foi possível buscar um meme. Tente novamente mais tarde."
          ),
        ],
      });
    }
  },
};

export default command;
