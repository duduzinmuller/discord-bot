import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors, createErrorEmbed } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "enquete",
    description: "Cria uma enquete com opções",
    aliases: ["poll", "votacao"],
    category: "diversao",
    usage: "<pergunta> | <opção1> | <opção2> | [opção3] ...",
  },

  execute: async (message: any, args: string[]) => {
    const options = args
      .join(" ")
      .split("|")
      .map((opt) => opt.trim());

    if (options.length < 3) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Formato Inválido",
            `Use: \`${message.client.prefix}enquete Qual sua cor favorita? | Azul | Verde | Vermelho\``
          ),
        ],
      });
    }

    const question = options[0];
    const choices = options.slice(1);

    if (choices.length > 10) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Muitas Opções",
            "O máximo de opções permitido é 10."
          ),
        ],
      });
    }

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

    const embed = createEmbed({
      title: "📊 Enquete",
      description: `**${question}**\n\n${choices
        .map((choice, i) => `${emojis[i]} ${choice}`)
        .join("\n")}`,
      color: Colors.PRIMARY as ColorResolvable,
      footer: { text: `Criado por ${message.author.tag}` },
      timestamp: true,
    });

    const pollMessage = await message.channel.send({ embeds: [embed] });

    for (let i = 0; i < choices.length; i++) {
      await pollMessage.react(emojis[i]);
    }
  },
};

export default command;
