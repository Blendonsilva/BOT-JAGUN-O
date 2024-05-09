const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "formulário", // Coloque o nome do comando
  description: "Abra o painel de registro de vendas para os membros.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_formulário",
        description: "Canal para enviar o registro de vendas para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_logs",
        description: "Canal para enviar os registro de vendas recebidos.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        const canal_formulario = interaction.options.getChannel("canal_formulário")
        const canal_logs = interaction.options.getChannel("canal_logs")

        if (canal_formulario.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_formulario} não é um canal de texto.`, ephemeral: true })
        } else if (canal_logs.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_logs} não é um canal de texto.`, ephemeral: true })
        } else {
            await db.set(`canal_formulario_${interaction.guild.id}`, canal_formulario.id)
            await db.set(`canal_logs_${interaction.guild.id}`, canal_logs.id)

            let embed = new Discord.EmbedBuilder()
            .setDescription("Random")
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal Para Iniciar o Registro: ${canal_formulario}.\n> Canal Com Os Registros: ${canal_logs}.`)

            interaction.reply({ embeds: [embed], ephemeral: true }).then( () => {
                let embed_formulario = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Registro de vendas:`)
                .setDescription(`Registre sua venda clicando no botão abaixo!`);

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("formulario")
                    .setEmoji("☝")
                    .setLabel("Clique Aqui!")
                    .setStyle(Discord.ButtonStyle.Primary)
                );

                canal_formulario.send({ embeds: [embed_formulario], components: [botao] })
            })
        } 
    }
  }
}