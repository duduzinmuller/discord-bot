import { ColorResolvable, Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors } from "../../utils/embeds.js";
import axios from "axios";

const command: Command = {
  data: {
    name: "fato",
    description: "Mostra um fato aleatório interessante",
    aliases: ["fact", "curiosidade"],
    category: "diversao",
  },

  execute: async (message: Message) => {
    try {
      const response: any = await axios.get(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );

      const fact = response.data.text;

      const translationResponse: any = await axios.post(
        "https://libretranslate.de/translate",
        {
          q: fact,
          source: "en",
          target: "pt",
          format: "text",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const translatedFact = translationResponse.data.translatedText;

      const embed = createEmbed({
        title: "🤓 Fato Curioso",
        description: translatedFact,
        color: Colors.SUCCESS as ColorResolvable,
        footer: { text: `Solicitado por ${message.author.tag}` },
        timestamp: true,
      });

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro ao buscar fato ou traduzir:", error);

      const embed = createEmbed({
        title: "❌ Erro",
        description:
          "Não foi possível buscar um fato curioso. Tente novamente mais tarde.",
        color: Colors.ERROR as ColorResolvable,
        timestamp: true,
      });

      await message.reply({ embeds: [embed] });
    }
  },
};

export default command;
