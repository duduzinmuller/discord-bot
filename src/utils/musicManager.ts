import { logger } from './logger.js';

// Define the song interface
interface Song {
  title: string;
  url: string;
  thumbnail: string | null;
  duration: number;
  requestedBy: string;
}

// Define the queue interface
interface Queue {
  textChannel: string;
  songs: Song[];
  volume: number;
  playing: boolean;
}

// Store queues for each guild
const queues = new Map<string, Queue>();

// Get the queue for a guild
export function getQueue(guildId: string): Queue | undefined {
  return queues.get(guildId);
}

// Set up queue for a guild
export function setupQueueForGuild(guildId: string, textChannelId?: string): Queue {
  // If queue already exists, return it
  const existingQueue = queues.get(guildId);
  if (existingQueue) {
    return existingQueue;
  }
  
  // Create a new queue
  const queueConstructor: Queue = {
    textChannel: textChannelId || '',
    songs: [],
    volume: 50,
    playing: false
  };
  
  queues.set(guildId, queueConstructor);
  return queueConstructor;
}

// Add a song to the queue
export async function addToQueue(guildId: string, song: Song): Promise<Queue> {
  let queue = queues.get(guildId);
  
  if (!queue) {
    queue = setupQueueForGuild(guildId);
  }
  
  // Add the song to the queue
  queue.songs.push(song);
  logger.debug(`Added song "${song.title}" to queue in guild ${guildId}`);
  
  return queue;
}

// Clear the queue
export function clearQueue(guildId: string): void {
  const queue = queues.get(guildId);
  
  if (queue) {
    queue.songs = [];
    queue.playing = false;
    logger.debug(`Cleared queue in guild ${guildId}`);
  }
}

// Remove a song from the queue by index
export function removeSong(guildId: string, index: number): Song | undefined {
  const queue = queues.get(guildId);
  
  if (!queue || !queue.songs[index]) {
    return undefined;
  }
  
  // Remove the song and return it
  const removedSong = queue.songs.splice(index, 1)[0];
  logger.debug(`Removed song "${removedSong.title}" from queue in guild ${guildId}`);
  
  return removedSong;
}

// Shuffle the queue
export function shuffleQueue(guildId: string): boolean {
  const queue = queues.get(guildId);
  
  if (!queue || queue.songs.length <= 1) {
    return false;
  }
  
  // Keep the current playing song
  const currentSong = queue.songs[0];
  const remainingSongs = queue.songs.slice(1);
  
  // Shuffle the remaining songs
  for (let i = remainingSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
  }
  
  // Reconstruct the queue
  queue.songs = [currentSong, ...remainingSongs];
  logger.debug(`Shuffled queue in guild ${guildId}`);
  
  return true;
}