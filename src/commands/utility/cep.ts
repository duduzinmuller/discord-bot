import { ColorResolvable } from "discord.js";
import { Command } from "../../types/Command.js";
import { createEmbed, createErrorEmbed, Colors } from "../../utils/embeds.js";
import axios from "axios";

const command: Command = {
  data: {
    name: "cep",
    description: "Consulta informações de um CEP.",
    aliases: ["endereco", "buscarcep"],
    category: "utilidade",
    usage: "<cep>",
  },

  execute: async (message: any, args: string[]) => {
    const cep = args[0]?.replace(/\D/g, "");

    if (!cep || cep.length !== 8) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "CEP Inválido",
            `Você precisa fornecer um CEP válido (apenas números, 8 dígitos). Exemplo: \`${message.client.prefix}cep 01001000\``
          ),
        ],
      });
    }

    try {
      const response: any = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (response.data.erro) {
        return message.reply({
          embeds: [
            createErrorEmbed(
              "CEP Não Encontrado",
              `Não foi possível encontrar o CEP \`${cep}\`. Verifique se ele está correto.`
            ),
          ],
        });
      }

      const { logradouro, bairro, localidade, uf, ddd } = response.data;

      return message.reply({
        embeds: [
          createEmbed({
            title: "📍 Informações do CEP",
            description:
              `🔹 **Logradouro:** ${logradouro || "N/A"}\n` +
              `🔹 **Bairro:** ${bairro || "N/A"}\n` +
              `🔹 **Cidade:** ${localidade} - ${uf}\n` +
              `🔹 **DDD:** ${ddd}\n\n` +
              `🔎 Resultado para: \`${cep}\``,
            color: Colors.PRIMARY as ColorResolvable,
          }),
        ],
      });
    } catch (error) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            "Erro ao Consultar CEP",
            "Houve um problema ao tentar buscar as informações. Tente novamente mais tarde."
          ),
        ],
      });
    }
  },
};

export default command;
