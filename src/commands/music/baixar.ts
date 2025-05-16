import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";
import play, { YouTubeVideo } from "play-dl";
import { logger } from "../../utils/logger.js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import https from "https";

const execAsync = util.promisify(exec);

const ytDlpPath = path.resolve("bin", "yt-dlp");

async function ensureYtDlpInstalled() {
  if (!fs.existsSync(ytDlpPath)) {
    const binDir = path.dirname(ytDlpPath);
    fs.mkdirSync(binDir, { recursive: true });

    const file = fs.createWriteStream(ytDlpPath);
    const url =
      "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";

    await new Promise<void>((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(new Error("Falha ao baixar yt-dlp."));
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          fs.chmodSync(ytDlpPath, 0o755);
          resolve();
        });
      }).on("error", reject);
    });
  }
}

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
      await ensureYtDlpInstalled();

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
        `${ytDlpPath} -x --audio-format mp3 -o "${outputPath}" "${url}"`
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
            "Ocorreu um erro ao tentar baixar a música. Certifique-se de que o YT-DLP foi baixado corretamente."
          ),
        ],
      });
    }
  },
};

export default command;
