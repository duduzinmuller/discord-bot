import { EmbedBuilder, ColorResolvable } from 'discord.js';

export const Colors = {
  PRIMARY: '#5865F2',
  SUCCESS: '#57F287',
  ERROR: '#ED4245',
  WARNING: '#FEE75C',
  INFO: '#5865F2',
  MUSIC: '#EB459E'
};

export function createEmbed(options: {
  title?: string;
  description?: string;
  color?: ColorResolvable;
  thumbnail?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string; iconURL?: string };
  author?: { name: string; iconURL?: string; url?: string };
  image?: string;
  timestamp?: boolean | number | Date;
}) {
  const embed = new EmbedBuilder();
  
  if (options.title) embed.setTitle(options.title);
  if (options.description) embed.setDescription(options.description);
  if (options.color) embed.setColor(options.color as ColorResolvable);
  if (options.thumbnail) embed.setThumbnail(options.thumbnail);
  if (options.fields) embed.addFields(options.fields);
  if (options.footer) embed.setFooter(options.footer);
  if (options.author) embed.setAuthor(options.author);
  if (options.image) embed.setImage(options.image);
  if (options.timestamp) {
    if (options.timestamp === true) {
      embed.setTimestamp();
    } else {
      embed.setTimestamp(options.timestamp);
    }
  }
  
  return embed;
}

export function createSuccessEmbed(title: string, description: string) {
  return createEmbed({
    title,
    description,
    color: `#${Colors.SUCCESS.substring(1)}` as ColorResolvable,
    timestamp: true,
  });
}

export function createErrorEmbed(title: string, description: string) {
  return createEmbed({
    title,
    description,
    color: `#${Colors.ERROR.substring(1)}` as ColorResolvable,
    timestamp: true,
  });
}

export function createMusicEmbed(title: string, description: string) {
  return createEmbed({
    title,
    description,
    color: `#${Colors.MUSIC.substring(1)}` as ColorResolvable,
    timestamp: true,
  });
}