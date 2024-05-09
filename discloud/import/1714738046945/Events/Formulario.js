require('../index')

const Discord = require('discord.js')
const client = require('../index')
const { QuickDB } = require("quick.db")
const db = new QuickDB();

client.on("interactionCreate", async(interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "formulario") {
        if (!interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
        const modal = new Discord.ModalBuilder()
        .setCustomId("modal")
        .setTitle("Formulário");
  
        const pergunta1 = new Discord.TextInputBuilder()
        .setCustomId("pergunta1") // Coloque o ID da pergunta
        .setLabel("Organização/Família ?") // Coloque a pergunta
        .setMaxLength(130) // Máximo de caracteres para a resposta
        .setMinLength(2) // Mínimo de caracteres para a respósta
        .setPlaceholder("Organização / Família !") // Mensagem que fica antes de escrever a resposta
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
  
        const pergunta2 = new Discord.TextInputBuilder()
        .setCustomId("pergunta2") // Coloque o ID da pergunta
        .setLabel("Quantidade de produtos vendidos ?") // Coloque a pergunta
        .setMaxLength(130) // Máximo de caracteres para a resposta
        .setPlaceholder("Quantidade de produtos vendidos!") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
        .setRequired(false)
  
        const pergunta3 = new Discord.TextInputBuilder()
        .setCustomId("pergunta3") // Coloque o ID da pergunta
        .setLabel("Valor total da venda ?") // Coloque a pergunta
        .setPlaceholder("Valor total da venda !") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
        .setRequired(false)
  
        modal.addComponents(
          new Discord.ActionRowBuilder().addComponents(pergunta1),
          new Discord.ActionRowBuilder().addComponents(pergunta2),
          new Discord.ActionRowBuilder().addComponents(pergunta3)
        )
  
        await interaction.showModal(modal)
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "modal") {
        let resposta1 = interaction.fields.getTextInputValue("pergunta1")
        let resposta2 = interaction.fields.getTextInputValue("pergunta2")
        let resposta3 = interaction.fields.getTextInputValue("pergunta3")
  
        if (!resposta1) resposta1 = "Não informado."
        if (!resposta2) resposta2 = "Não informado."
        if (!resposta3) resposta3 = "Não informado."
  
        let embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`O usuário ${interaction.user} enviou uma venda abaixo:`)
        .addFields(
          {
            name: `Organização / Família:`,
            value: ` \`${resposta1}\``,
            inline: false
          },
          {
            name: `Quantidade de produtos vendidos:`,
            value: ` \`${resposta2}\``,
            inline: false
          },
          {
            name: `Valor total da venda:`,
            value: ` \`${resposta3}\``,
            inline: false
          }
        );
  
        interaction.reply({ content: `Olá **${interaction.user.username}**, Sua Venda Foi Registrada Com Sucesso!`, ephemeral: true})
        await interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`)).send({ embeds: [embed] })
      }
    }
  })