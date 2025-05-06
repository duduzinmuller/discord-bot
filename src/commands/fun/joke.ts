import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors } from "../../utils/embeds.js";
import axios from "axios";

const command: Command = {
  data: {
    name: "piada",
    description: "Conta uma piada aleatória",
    aliases: ["joke", "rir"],
    category: "diversao",
  },

  execute: async (message: any) => {
    try {
      const loadingMessage = await message.channel.send(
        "Procurando uma piada..."
      );

      const response: any = await axios.get(
        "https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun?lang=pt&blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart"
      );

      if (response.data.error) {
        throw new Error("Falha ao buscar piada");
      }

      const embed = createEmbed({
        title: "😂 Aqui está uma piada!",
        description: `**${response.data.setup}**\n\n${response.data.delivery}`,
        color: Colors.MUSIC as ColorResolvable,
        footer: {
          text: `Categoria: ${response.data.category} | Solicitado por ${message.author.tag}`,
        },
        timestamp: true,
      });

      await loadingMessage.edit({ content: null, embeds: [embed] });
    } catch (error) {
      console.error("Erro ao buscar piada:", error);

      const errorEmbed = createEmbed({
        title: "❌ Erro",
        description:
          "Não consegui encontrar uma piada. Tente novamente mais tarde.",
        color: Colors.MUSIC as ColorResolvable,
        timestamp: true,
      });

      await message.reply({ embeds: [errorEmbed] });
    }
  },
};

export default command;
