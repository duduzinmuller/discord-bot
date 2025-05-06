import { Client, GatewayIntentBits, Collection } from "discord.js";
import { config } from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { logger } from "./utils/logger.js";
import { Command } from "./types/Command.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
    prefix: string;
  }
}

client.commands = new Collection();
client.prefix = process.env.PREFIX || "/";

const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);

  if (!fs.statSync(folderPath).isDirectory()) continue;

  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);

    import(filePath)
      .then((module) => {
        const command = module.default as Command;
        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
          logger.debug(`Loaded command: ${command.data.name}`);
        } else {
          logger.warn(`Command at ${filePath} is missing required properties.`);
        }
      })
      .catch((error) => {
        logger.error(`Failed to load command at ${filePath}:`, error);
      });
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);

  import(filePath)
    .then((module) => {
      const event = module.default;
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      logger.debug(`Loaded event: ${event.name}`);
    })
    .catch((error) => {
      logger.error(`Failed to load event at ${filePath}:`, error);
    });
}

client
  .login(process.env.BOT_TOKEN)
  .then(() => logger.info("Bot logged in successfully"))
  .catch((error) => logger.error("Failed to log in:", error));

process.on("SIGINT", () => {
  logger.info("Bot is shutting down...");
  client.destroy();
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
});
