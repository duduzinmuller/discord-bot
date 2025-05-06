import { Message, GuildMember, TextChannel, ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import {
  createEmbed,
  Colors,
  createErrorEmbed,
  createMusicEmbed,
} from "../../utils/embeds.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  DiscordGatewayAdapterCreator,
} from "@discordjs/voice";
import play, { YouTubeVideo } from "play-dl";
import { logger } from "../../utils/logger.js";
import {
  getQueue,
  addToQueue,
  setupQueueForGuild,
} from "../../utils/musicManager.js";

const command: Command = {
  data: {
    name: "tocar",
    description: "Toca música do YouTube",
    aliases: ["play", "p"],
    category: "musica",
    usage: "<música ou URL>",
  },

  execute: async (message: Message, args: string[]) => {
    if (!args.length) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Argumentos Faltando",
            `Por favor, forneça uma música ou URL. Uso: \`${message.client.prefix}tocar <música ou URL>\``
          ),
        ],
      });
    }

    const member = message.member as GuildMember;
    if (!member.voice.channel) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Canal de Voz Necessário",
            "Você precisa estar em um canal de voz para usar este comando!"
          ),
        ],
      });
    }

    const initialReply = await message.reply({
      embeds: [
        createEmbed({
          title: "🔍 Pesquisando...",
          description: `Procurando por: \`${args.join(" ")}\``,
          color: Colors.PRIMARY as ColorResolvable,
        }),
      ],
    });

    try {
      const query = args.join(" ");
      let result: YouTubeVideo[];

      const urlPattern =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

      if (urlPattern.test(query)) {
        result = await play.search(query, { limit: 1 }) as YouTubeVideo[];
      } else {
        result = await play.search(query, { limit: 1 }) as YouTubeVideo[];
      }

      const songInfo = result[0];

      if (!songInfo) {
        return initialReply.edit({
          embeds: [
            createErrorEmbed(
              "Nenhum Resultado",
              "Nenhuma música foi encontrada. Tente uma pesquisa diferente."
            ),
          ],
        });
      }

      if (!message.guild) return;
      const guildId = message.guild.id;
      setupQueueForGuild(guildId);

      const song = {
        title: songInfo.title || "Título Desconhecido",
        url: songInfo.url,
        thumbnail:
          songInfo.thumbnails && songInfo.thumbnails.length > 0
            ? songInfo.thumbnails[0].url
            : null,
        duration: songInfo.durationInSec,
        requestedBy: message.author.tag,
      };

      const queue = await addToQueue(guildId, song);

      if (queue.songs.length === 1) {
        try {
          const connection = joinVoiceChannel({
            channelId: member.voice.channel.id,
            guildId: guildId,
            adapterCreator: message.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
          });

          const player = createAudioPlayer();
          connection.subscribe(player);

          connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
              connection.rejoin();
            } catch (error) {
              connection.destroy();
              queue.playing = false;
              queue.songs = [];
              logger.error(
                "Conexão de voz desconectada e não foi possível reconectar:",
                error
              );
            }
          });

          const playSong = async () => {
            const currentQueue = getQueue(guildId);
            if (!currentQueue || currentQueue.songs.length === 0) {
              connection.destroy();
              return;
            }

            const currentSong = currentQueue.songs[0];

            try {
              const stream = await play.stream(currentSong.url);
              const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
              });

              player.play(resource);

              (message.channel as TextChannel).send({
                embeds: [
                  createMusicEmbed(
                    "🎵 Tocando Agora",
                    `[${currentSong.title}](${currentSong.url})`
                  ),
                ],
              });

              player.on(AudioPlayerStatus.Idle, () => {
                const updatedQueue = getQueue(guildId);
                if (!updatedQueue) return;

                updatedQueue.songs.shift(); // Remove a música da fila

                if (updatedQueue.songs.length > 0) {
                  playSong(); // Toca a próxima música
                } else {
                  connection.destroy(); // Finaliza a conexão de voz quando a fila termina
                  (message.channel as TextChannel).send({
                    embeds: [
                      createEmbed({
                        title: "🎵 Fila Terminada",
                        description:
                          "Não há mais músicas na fila. Saindo do canal de voz.",
                        color: Colors.PRIMARY as ColorResolvable,
                      }),
                    ],
                  });
                }
              });
            } catch (error) {
              logger.error("Erro ao tocar música:", error);
              (message.channel as TextChannel).send({
                embeds: [
                  createErrorEmbed(
                    "Erro na Reprodução",
                    `Não foi possível tocar a música: ${currentSong.title}`
                  ),
                ],
              });

              currentQueue.songs.shift(); // Remove a música com erro da fila
              if (currentQueue.songs.length > 0) {
                playSong(); // Tenta tocar a próxima música
              } else {
                connection.destroy(); // Se a fila estiver vazia, encerra a conexão
              }
            }
          };

          playSong();
          queue.playing = true;

          initialReply.edit({
            embeds: [
              createMusicEmbed(
                "🎵 Adicionado à Fila",
                `[${song.title}](${song.url})`
              ),
            ],
          });
        } catch (error) {
          logger.error("Erro ao entrar no canal de voz:", error);

          initialReply.edit({
            embeds: [
              createErrorEmbed(
                "Erro de Conexão",
                "Não foi possível entrar no seu canal de voz. Tente novamente."
              ),
            ],
          });
        }
      } else {
        initialReply.edit({
          embeds: [
            createMusicEmbed(
              "🎵 Adicionado à Fila",
              `[${song.title}](${song.url})\n\nPosição na fila: ${
                queue.songs.length - 1
              }`
            ),
          ],
        });
      }
    } catch (error) {
      logger.error("Erro no comando de tocar:", error);

      initialReply.edit({
        embeds: [
          createErrorEmbed(
            "Erro no Comando",
            "Ocorreu um erro ao tentar tocar a música. Tente novamente mais tarde."
          ),
        ],
      });
    }
  },
};

export default command;
