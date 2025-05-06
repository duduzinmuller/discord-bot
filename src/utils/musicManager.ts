import { logger } from "./logger.js";

interface Song {
  title: string;
  url: string;
  thumbnail: string | null;
  duration: number;
  requestedBy: string;
}

interface Queue {
  textChannel: string;
  songs: Song[];
  volume: number;
  playing: boolean;
}

const queues = new Map<string, Queue>();

export function getQueue(guildId: string): Queue | undefined {
  return queues.get(guildId);
}

export function setupQueueForGuild(
  guildId: string,
  textChannelId?: string
): Queue {
  const existingQueue = queues.get(guildId);
  if (existingQueue) {
    return existingQueue;
  }

  const queueConstructor: Queue = {
    textChannel: textChannelId || "",
    songs: [],
    volume: 50,
    playing: false,
  };

  queues.set(guildId, queueConstructor);
  return queueConstructor;
}

export async function addToQueue(guildId: string, song: Song): Promise<Queue> {
  let queue = queues.get(guildId);

  if (!queue) {
    queue = setupQueueForGuild(guildId);
  }

  queue.songs.push(song);
  logger.debug(`Added song "${song.title}" to queue in guild ${guildId}`);

  return queue;
}

export function clearQueue(guildId: string): void {
  const queue = queues.get(guildId);

  if (queue) {
    queue.songs = [];
    queue.playing = false;
    logger.debug(`Cleared queue in guild ${guildId}`);
  }
}

export function removeSong(guildId: string, index: number): Song | undefined {
  const queue = queues.get(guildId);

  if (!queue || !queue.songs[index]) {
    return undefined;
  }

  const removedSong = queue.songs.splice(index, 1)[0];
  logger.debug(
    `Removed song "${removedSong.title}" from queue in guild ${guildId}`
  );

  return removedSong;
}

export function shuffleQueue(guildId: string): boolean {
  const queue = queues.get(guildId);

  if (!queue || queue.songs.length <= 1) {
    return false;
  }

  const currentSong = queue.songs[0];
  const remainingSongs = queue.songs.slice(1);

  for (let i = remainingSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingSongs[i], remainingSongs[j]] = [
      remainingSongs[j],
      remainingSongs[i],
    ];
  }

  queue.songs = [currentSong, ...remainingSongs];
  logger.debug(`Shuffled queue in guild ${guildId}`);

  return true;
}
