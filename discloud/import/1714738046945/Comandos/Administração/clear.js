const Discord = require("discord.js");

module.exports = {
    name: "clear",
    description: "Limpe o canal de texto",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Número de mensagens para serem apagadas.',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const quantidade = interaction.options.getNumber('quantidade');

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
            return;
        }

        if (quantidade <= 0 || quantidade > 99) {
            interaction.reply({ content: "Por favor, forneça um número entre 1 e 99.", ephemeral: true });
            return;
        }

        const messages = await interaction.channel.messages.fetch({ limit: quantidade });
        const filteredMessages = messages.filter(message => (Date.now() - message.createdTimestamp) <= 1209600000); // 14 dias em milissegundos

        try {
            await interaction.channel.bulkDelete(filteredMessages);
            interaction.reply(`Foram deletadas ${filteredMessages.size} mensagens. \n**Caso nenhuma menssagem seja Exlcuida acima, verifique se tem mais de 14 dias a menssagem \nCaso tenha mais de 14 dias não sera possivel apagar**`);
        } catch (error) {
            console.error('Erro ao excluir mensagens:', error);
            interaction.reply({ content: 'Ocorreu um erro ao tentar excluir as mensagens.', ephemeral: true });
        }
    }
};
