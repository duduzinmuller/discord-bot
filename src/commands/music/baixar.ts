import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";
import play, { YouTubeVideo } from "play-dl";
import { logger } from "../../utils/logger.js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

const command: Command = {
  data: {
    name: "baixar",
    description: "Baixa uma música do YouTube",
    aliases: ["download", "ytmp3"],
    category: "musica",
    usage: "<música ou URL>",
  },

  execute: async (message: any, args: string[]) => {
    if (!args.length) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Argumentos Faltando",
            `Por favor, forneça uma música ou URL. Uso: \`${message.client.prefix}baixar <música ou URL>\``
          ),
        ],
      });
    }

    const query = args.join(" ");
    const reply = await message.reply({
      embeds: [
        createEmbed({
          title: "🔍 Procurando...",
          description: `Buscando: \`${query}\``,
          color: Colors.PRIMARY as ColorResolvable,
        }),
      ],
    });

    try {
      const result = (await play.search(query, { limit: 1 })) as YouTubeVideo[];
      const songInfo = result[0];

      if (!songInfo) {
        return reply.edit({
          embeds: [
            createErrorEmbed(
              "Nenhum Resultado",
              "Não encontrei nenhuma música. Tente outro nome ou link."
            ),
          ],
        });
      }

      const url = songInfo.url;
      const title = songInfo.title?.replace(/[^a-zA-Z0-9]/g, "_") || "musica";
      const filename = `${title}_${Date.now()}.mp3`;
      const outputPath = path.resolve("downloads", filename);

      if (!fs.existsSync("downloads")) {
        fs.mkdirSync("downloads");
      }

      await execAsync(
        `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`
      );

      await message.channel.send({
        content: `🎵 **${songInfo.title}** baixado com sucesso!`,
        files: [outputPath],
      });

      fs.unlinkSync(outputPath);

      await reply.delete();
    } catch (error) {
      logger.error("Erro ao baixar música:", error);

      return reply.edit({
        embeds: [
          createErrorEmbed(
            "Erro ao Baixar",
            "Ocorreu um erro ao tentar baixar a música. Certifique-se de que o YouTube-DL ou YT-DLP está instalado corretamente."
          ),
        ],
      });
    }
  },
};

export default command;
