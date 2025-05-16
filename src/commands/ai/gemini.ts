import { ColorResolvable, Message } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, Colors, createErrorEmbed } from "../../utils/embeds.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const userConversations = new Map<string, string[]>();

const command: Command = {
  data: {
    name: "gemini",
    description: "Faz uma pergunta para o Google Gemini AI",
    aliases: ["ai", "g"],
    category: "ia",
    usage: "<pergunta>",
  },

  execute: async (message: Message, args: string[]) => {
    if (args.length === 0) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Pergunta Faltando",
            `Por favor, faça uma pergunta! Exemplo: \`${message.client.prefix}gemini Como funciona a fotossíntese?\``
          ),
        ],
      });
    }

    const question = args.join(" ");
    const userId = message.author.id;

    let conversation = userConversations.get(userId) || [];

    conversation.push(`Usuário: ${question}`);

    const prompt = conversation.join("\n") + "\nAssistente:";

    const loadingMessage = await message.reply({
      embeds: [
        createEmbed({
          title: "🤔 Pensando...",
          description: "Processando sua pergunta...",
          color: Colors.MUSIC as ColorResolvable,
        }),
      ],
    });

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      conversation.push(`Assistente: ${text}`);

      userConversations.set(userId, conversation);

      const embed = createEmbed({
        title: "🤖 Resposta do Google Gemini",
        description: text || "Não consegui gerar uma resposta.",
        color: Colors.SUCCESS as ColorResolvable,
        footer: { text: `Solicitado por ${message.author.tag}` },
        timestamp: true,
      });

      await loadingMessage.edit({ embeds: [embed] });
    } catch (error) {
      console.error("Erro ao usar Gemini:", error);

      await loadingMessage.edit({
        embeds: [
          createErrorEmbed(
            "Erro",
            "Ocorreu um erro ao processar sua pergunta. Tente novamente mais tarde."
          ),
        ],
      });
    }
  },
};

export default command;
