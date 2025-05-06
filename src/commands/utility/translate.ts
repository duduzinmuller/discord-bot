import { ColorResolvable, Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors, createErrorEmbed } from "../../utils/embeds.js";
import gt from "google-translate-api-x";
const translate = gt.default;

const languageMap: Record<string, string> = {
  africâner: "af",
  albanês: "sq",
  alemão: "de",
  amárico: "am",
  árabe: "ar",
  armênio: "hy",
  azerbaijano: "az",
  basco: "eu",
  bielorrusso: "be",
  birmanês: "my",
  bósnio: "bs",
  búlgaro: "bg",
  canarim: "kn",
  catalão: "ca",
  cazaque: "kk",
  cebuano: "ceb",
  chichewa: "ny",
  "chinês (simplificado)": "zh-cn",
  "chinês (tradicional)": "zh-tw",
  cingalês: "si",
  cmer: "km",
  coreano: "ko",
  corso: "co",
  "crioulo haitiano": "ht",
  croata: "hr",
  curdo: "ku",
  dinamarquês: "da",
  eslovaco: "sk",
  esloveno: "sl",
  espanhol: "es",
  esperanto: "eo",
  estoniano: "et",
  filipino: "tl",
  finlandês: "fi",
  francês: "fr",
  frísio: "fy",
  "gaélico escocês": "gd",
  galego: "gl",
  galês: "cy",
  georgiano: "ka",
  grego: "el",
  guzerate: "gu",
  hauçá: "ha",
  havaiano: "haw",
  hebraico: "he",
  hindi: "hi",
  hmong: "hmn",
  holandês: "nl",
  húngaro: "hu",
  igbo: "ig",
  iídiche: "yi",
  indonésio: "id",
  inglês: "en",
  iorubá: "yo",
  irlandês: "ga",
  islandês: "is",
  italiano: "it",
  japonês: "ja",
  javanês: "jw",
  laosiano: "lo",
  latim: "la",
  letão: "lv",
  lituano: "lt",
  luxemburguês: "lb",
  macedônio: "mk",
  malaiala: "ml",
  malaio: "ms",
  malgaxe: "mg",
  maltês: "mt",
  maori: "mi",
  marata: "mr",
  mongol: "mn",
  nepalês: "ne",
  norueguês: "no",
  oriá: "or",
  pachto: "ps",
  panjabi: "pa",
  persa: "fa",
  polonês: "pl",
  português: "pt",
  quirguiz: "ky",
  romeno: "ro",
  russo: "ru",
  samoano: "sm",
  sérvio: "sr",
  sesoto: "st",
  shona: "sn",
  sindi: "sd",
  somali: "so",
  suaíli: "sw",
  sueco: "sv",
  sudanês: "su",
  tailandês: "th",
  tajique: "tg",
  tâmil: "ta",
  tcheco: "cs",
  telugo: "te",
  turco: "tr",
  ucraniano: "uk",
  uigur: "ug",
  urdu: "ur",
  uzbeque: "uz",
  vietnamita: "vi",
  xhosa: "xh",
  zulu: "zu",
};

const supportedLanguages = Object.values(languageMap);

const command: Command = {
  data: {
    name: "traduzir",
    description: "Traduz um texto para outro idioma",
    aliases: ["translate", "tr"],
    category: "utilidade",
    usage: "<idioma> <texto>",
  },

  execute: async (message: Message, args: string[]) => {
    if (args.length < 2) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Argumentos Insuficientes",
            `Use: \`${message.client.prefix}traduzir <idioma> <texto>\`\nExemplo: \`${message.client.prefix}traduzir en Olá mundo!\``
          ),
        ],
      });
    }

    const langInput = args[0].toLowerCase();
    const text = args.slice(1).join(" ");

    const targetLang =
      languageMap[langInput] ||
      (supportedLanguages.includes(langInput) ? langInput : null);

    if (!targetLang) {
      const idiomasDisponiveis = Object.entries(languageMap)
        .map(
          ([nome, codigo]) =>
            `\`${codigo}\` - ${nome.charAt(0).toUpperCase() + nome.slice(1)}`
        )
        .join("\n");

      return message.reply({
        embeds: [
          createErrorEmbed(
            "Idioma não suportado",
            `O idioma "${langInput}" não é válido.\n\nIdiomas disponíveis:\n${idiomasDisponiveis}`
          ),
        ],
      });
    }

    try {
      const result = await translate(text, { to: targetLang });

      const embed = createEmbed({
        title: "🌐 Tradução",
        fields: [
          { name: "Texto Original", value: text },
          { name: "Tradução", value: result.text },
        ],
        color: Colors.SUCCESS as ColorResolvable,
        footer: { text: `${result.from.language.iso} ➜ ${targetLang}` },
        timestamp: true,
      });

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Erro na tradução:", error);

      await message.reply({
        embeds: [
          createErrorEmbed(
            "Erro na Tradução",
            "Não foi possível traduzir o texto. Verifique o idioma ou tente novamente mais tarde."
          ),
        ],
      });
    }
  },
};

export default command;
