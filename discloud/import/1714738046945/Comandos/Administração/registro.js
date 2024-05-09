const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "registro", // Coloque o nome do comando
  description: "Abra o painel de registro de usuario para os membros.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_registro",
        description: "Canal para enviar o registro de usuario para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_registrologs",
        description: "Canal para enviar os registro de usuario recebidos.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        const canal_registro = interaction.options.getChannel("canal_registro")
        const canal_registrologs = interaction.options.getChannel("canal_registrologs")

        if (canal_registro.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_registro} não é um canal de texto.`, ephemeral: true })
        } else if (canal_registrologs.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_registrologs} não é um canal de texto.`, ephemeral: true })
        } else {
            await db.set(`canal_registro_${interaction.guild.id}`, canal_registro.id)
            await db.set(`canal_registrologs_${interaction.guild.id}`, canal_registrologs.id)

            let rembed = new Discord.EmbedBuilder()
            .setDescription("Random")
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal Para Iniciar o Registro: ${canal_registro}.\n> Canal Com Os Registros: ${canal_registrologs}.`)

            interaction.reply({ embeds: [rembed], ephemeral: true }).then( () => {
                let rembed_registro = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Registro de membros:`)
                .setDescription(`Registre sua venda clicando no botão abaixo!`);

                let botao2 = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("registro")
                    .setEmoji("☝")
                    .setLabel("Clique Aqui!")
                    .setStyle(Discord.ButtonStyle.Primary)
                );

                canal_registro.send({ embeds: [rembed_registro], components: [botao2] })
            })
        } 
    }
  }
}