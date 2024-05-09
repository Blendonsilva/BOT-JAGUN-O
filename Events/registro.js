const Discord = require('discord.js');
const client = require('../index');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

client.on("interactionCreate", async(interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "registro") {
        if (!interaction.guild.channels.cache.get(await db.get(`canal_registrologs_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
        const rmodalr = new Discord.ModalBuilder()
        .setCustomId("rmodalr")
        .setTitle("Registro");

        const registro1 = new Discord.TextInputBuilder()
        .setCustomId("registro1") // Coloque o ID da pergunta
        .setLabel("Nome do Personagem ?") // Coloque a pergunta
        .setMaxLength(130) // Máximo de caracteres para a resposta
        .setMinLength(2) // Mínimo de caracteres para a respósta
        .setPlaceholder("EX: Jagunço silva") // Mensagem que fica antes de escrever a resposta
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)

        const registro2 = new Discord.TextInputBuilder()
        .setCustomId("registro2") // Coloque o ID da pergunta
        .setLabel("Id / Passaporte") // Coloque a pergunta
        .setMaxLength(130) // Máximo de caracteres para a resposta
        .setPlaceholder("EX: 1234") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
        .setRequired(false)

        const registro3 = new Discord.TextInputBuilder()
        .setCustomId("registro3") // Coloque o ID da pergunta
        .setLabel("Numero de Telefone da cidade") // Coloque a pergunta
        .setPlaceholder("EX: 555-555") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
        .setRequired(false)

        const registro4 = new Discord.TextInputBuilder()
        .setCustomId("registro4") // Coloque o ID da pergunta
        .setLabel("Quem recrutou ?") // Coloque a pergunta
        .setPlaceholder("EX: Sempre Sera o Cleitin !") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
        .setRequired(false)

        rmodalr.addComponents(
          new Discord.ActionRowBuilder().addComponents(registro1),
          new Discord.ActionRowBuilder().addComponents(registro2),
          new Discord.ActionRowBuilder().addComponents(registro3),
          new Discord.ActionRowBuilder().addComponents(registro4)
        )

        await interaction.showModal(rmodalr)
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "rmodalr") {
        let pergunta1 = interaction.fields.getTextInputValue("registro1")
        let pergunta2 = interaction.fields.getTextInputValue("registro2")
        let pergunta3 = interaction.fields.getTextInputValue("registro3")
        let pergunta4 = interaction.fields.getTextInputValue("registro4")

        if (!pergunta1) pergunta1 = "Não informado.";
        if (!pergunta2) pergunta2 = "Não informado.";
        if (!pergunta3) pergunta3 = "Não informado.";
        if (!pergunta4) pergunta4 = "Não informado.";

        let rembed = new Discord.EmbedBuilder()
        .setColor("Random")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`O usuário ${interaction.user} se registrou, segue abaixo:`)
        .addFields(
          {
            name: `Nome do personagem:`,
            value: `*\`${pergunta1}\`*`,
            inline: false
          },
          {
            name: `Id / Passaporte:`,
            value: `*\`${pergunta2}\`*`,
            inline: false
          },
          {
            name: `Numero de telefone:`,
            value:`*\`${pergunta3}\`*`,
            inline: false
          },
          {
            name: `Quem recrutou:`,
            value: `*\`${pergunta4}\`*`,
            inline: false
          }
        );

        interaction.reply({ content: `Jagunço **${interaction.user.username}**, Seu registro foi realizado com sucesso! `, ephemeral: true})
        await interaction.guild.channels.cache.get(await db.get(`canal_registrologs_${interaction.guild.id}`)).send({ embeds: [rembed] })

        // Alterar o nome do usuário
        const newUsername = `${pergunta1} | ${pergunta2}`;
        if (newUsername.length > 32) {
          interaction.reply({ content: `O nome do usuário não pode ter mais de 32 caracteres.`, ephemeral: true });
          return;
        }
        await interaction.member.setNickname(newUsername);
      }
    }
  })