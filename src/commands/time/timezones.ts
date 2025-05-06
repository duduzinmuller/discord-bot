import { Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors } from "../../utils/embeds.js";
import moment from "moment-timezone";

const command: Command = {
  data: {
    name: "fusos",
    description:
      "Mostra uma lista dos principais fusos horários e suas horas atuais",
    aliases: ["timezones", "horarios"],
    category: "tempo",
  },

  execute: async (message: Message) => {
    const majorTimezones = [
      "America/Sao_Paulo",
      "America/Manaus",
      "America/Belem",
      "America/New_York",
      "Europe/London",
      "Europe/Paris",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];

    const timezoneFields = majorTimezones.map((tz) => {
      const time = moment().tz(tz);
      const abbreviation = time.format("z");

      return {
        name: tz.replace("_", " "),
        value: `${time.format("HH:mm:ss")} (${abbreviation})`,
        inline: true,
      };
    });

    const embed = createEmbed({
      title: "🌐 Principais Fusos Horários",
      description: "Horários atuais nos principais fusos horários do mundo:",
      color: Colors.INFO as any,
      fields: timezoneFields,
      footer: {
        text: `Use "${message.client.prefix}hora [fuso horário]" para verificar um fuso horário específico`,
      },
      timestamp: true,
    });

    await message.reply({ embeds: [embed] });
  },
};

export default command;
