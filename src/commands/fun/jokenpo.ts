import { ColorResolvable, Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors, createErrorEmbed } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "jokenpo",
    description: "Joga Pedra, Papel ou Tesoura com o bot",
    aliases: ["ppt"],
    category: "diversao",
    usage: "<pedra|papel|tesoura>",
  },

  execute: async (message: Message, args: string[]) => {
    if (args.length === 0) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Escolha Faltando",
            `Escolha pedra, papel ou tesoura! Exemplo: \`${message.client.prefix}jokenpo pedra\``
          ),
        ],
      });
    }

    const choices = ["pedra", "papel", "tesoura"];
    const emojis = ["🪨", "📄", "✂️"];
    const userChoice = args[0].toLowerCase();

    if (!choices.includes(userChoice)) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Escolha Inválida",
            "Você deve escolher entre: pedra, papel ou tesoura!"
          ),
        ],
      });
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    const userIndex = choices.indexOf(userChoice);
    const botIndex = choices.indexOf(botChoice);

    let result;
    let color = Colors.PRIMARY;

    if (userIndex === botIndex) {
      result = "Empate! 🤝";
      color = Colors.WARNING;
    } else if (
      (userIndex === 0 && botIndex === 2) ||
      (userIndex === 1 && botIndex === 0) ||
      (userIndex === 2 && botIndex === 1)
    ) {
      result = "Você venceu! 🎉";
      color = Colors.SUCCESS;
    } else {
      result = "Eu venci! 😎";
      color = Colors.ERROR;
    }

    const embed = createEmbed({
      title: "🎮 Jokenpô",
      description: `**Sua escolha:** ${emojis[userIndex]} ${userChoice}\n**Minha escolha:** ${emojis[botIndex]} ${botChoice}\n\n**Resultado:** ${result}`,
      color: Colors.PRIMARY as ColorResolvable,
      footer: { text: `Jogado por ${message.author.tag}` },
      timestamp: true,
    });

    await message.reply({ embeds: [embed] });
  },
};

export default command;
