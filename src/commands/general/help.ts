import { ColorResolvable, Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors } from "../../utils/embeds.js";

const command: Command = {
  data: {
    name: "ajuda",
    description:
      "Mostra informações sobre todos os comandos ou um comando específico",
    aliases: ["help", "comandos", "h"],
    category: "geral",
    usage: "[comando]",
  },

  execute: async (message: Message, args: string[]) => {
    const { commands, prefix } = message.client;

    if (!args.length) {
      const categories = new Map<string, Command[]>();

      commands.forEach((command) => {
        const category = command.data.category;
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category)!.push(command);
      });

      const embed = createEmbed({
        title: "📚 Menu de Ajuda",
        description: `Use \`${prefix}ajuda [comando]\` para obter mais informações sobre um comando específico.`,
        color: Colors.MUSIC as ColorResolvable,
        thumbnail: message.client.user?.displayAvatarURL(),
        fields: [],
        footer: { text: `Solicitado por ${message.author.tag}` },
        timestamp: true,
      });

      const categoryNames = {
        geral: "Geral",
        musica: "Música",
        diversao: "Diversão",
        tempo: "Tempo",
      };

      for (const [category, cmds] of categories) {
        embed.addFields({
          name:
            categoryNames[category as keyof typeof categoryNames] || category,
          value: cmds.map((cmd) => `\`${cmd.data.name}\``).join(", "),
        });
      }

      return message.reply({ embeds: [embed] });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      [...commands.values()].find(
        (cmd) => cmd.data.aliases && cmd.data.aliases.includes(name)
      );

    if (!command) {
      return message.reply("Esse comando não existe!");
    }

    const embed = createEmbed({
      title: `Comando: ${command.data.name}`,
      description: command.data.description,
      color: Colors.MUSIC as ColorResolvable,
      fields: [
        {
          name: "Categoria",
          value:
            command.data.category.charAt(0).toUpperCase() +
            command.data.category.slice(1),
          inline: true,
        },
      ],
      footer: { text: `Solicitado por ${message.author.tag}` },
      timestamp: true,
    });

    if (command.data.aliases?.length) {
      embed.addFields({
        name: "Aliases",
        value: command.data.aliases.join(", "),
        inline: true,
      });
    }

    if (command.data.usage) {
      embed.addFields({
        name: "Uso",
        value: `${prefix}${command.data.name} ${command.data.usage}`,
        inline: true,
      });
    }

    return message.reply({ embeds: [embed] });
  },
};

export default command;
