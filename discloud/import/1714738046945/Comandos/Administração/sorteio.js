const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "sorteio",
  description: "Crie um sorteio no servidor",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "prêmio",
      type: Discord.ApplicationCommandOptionType.String,
      description: "Qual será o prêmio?",
      required: true,
    },
    {
      name: "descrição",
      type: Discord.ApplicationCommandOptionType.String,
      description: "Descreva o que será sorteado.",
      required: true,
    },
    {
      name: "tempo",
      type: Discord.ApplicationCommandOptionType.String,
      description: "Selecione o tempo do sorteio.",
      required: true,
      choices: [
        // Opções de tempo...
        {
          name: "30 Segundos",
          value: "30s",
        },
        {
          name: "1 Minuto",
          value: "1m",
        },
        {
          name: "5 Minutos",
          value: "5m",
        },
        {
          name: "10 Minutos",
          value: "10m",
        },
        {
          name: "15 Minutos",
          value: "15m",
        },
        {
          name: "30 Minutos",
          value: "30m",
        },
        {
          name: "45 Minutos",
          value: "45m",
        },
        {
          name: "1 Hora",
          value: "1h",
        },
        {
          name: "2 Horas",
          value: "2h",
        },
        {
          name: "5 Horas",
          value: "5h",
        },
        {
          name: "12 Horas",
          value: "12h",
        },
        {
          name: "1 Dia",
          value: "24h",
        },
        {
          name: "3 dias",
          value: "72h",
        },
        {
          name: "1 Semana",
          value: "168h",
        },
      ],
    },
    {
      name: "participantes",
      type: Discord.ApplicationCommandOptionType.Integer,
      description: "Quantidade de participantes.",
      required: true,
    },
  ],

  run: async (client, interaction, args) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
      interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
      return;
    }

    let premio = interaction.options.getString("prêmio");
    let tempo = interaction.options.getString("tempo");
    let desc = interaction.options.getString("descrição");
    let participantes = interaction.options.getInteger("participantes");

    let duracao = ms(tempo);

    let button = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("botao")
        .setEmoji("🎉")
        .setStyle(Discord.ButtonStyle.Secondary)
    );

    let click = [];

    let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `Novo sorteio!`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`> Patrocinador: ${interaction.user}.
        > Prêmio: **${premio}.**

        > ${desc}

        > Tempo: \`${tempo}\`.
        Clique no botão para parcipar.\n**Boa sorte!!!**`)
        .setTimestamp(Date.now() + ms(tempo))
        .setFooter({ text: "Data do sorteio:" })
        .setColor("Random");

      let erro = new Discord.EmbedBuilder()
      .setColor("Red")
      .setDescription(`Não foi possível promover o soteio!`);

    const msg = await interaction.reply({ embeds: [embed], components: [button] }).catch((e) => {
      interaction.reply({ embeds: [erro] });
    });

    const collector = msg.createMessageComponentCollector({
      time: ms(tempo),
    });

    collector.on("end", (i) => {
        interaction.editReply({ components: [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                  .setDisabled(true)
                  .setCustomId("botao")
                  .setEmoji("🎉")
                  .setStyle(Discord.ButtonStyle.Secondary)
              )
          ] });
    });

    collector.on("collect", (i) => {
      if (i.customId === "botao") {
        if (click.includes(i.user.id)) return i.reply({ content: `Olá ${interaction.user}, você já está participando do sorteio.`, ephemeral: true });

        click.push(i.user.id);

        interaction.editReply({ embeds: [embed] });

        i.reply({ content: `Olá ${interaction.user}, você entrou no sorteio.`, ephemeral: true });
      }
    });

    setTimeout(() => {
      let ganhadores = [];
      while (ganhadores.length < Math.min(participantes, click.length)) {
        let ganhador = click[Math.floor(Math.random() * click.length)];
        if (!ganhadores.includes(ganhador)) ganhadores.push(ganhador);
      }

      if (ganhadores.length === 0) return interaction.followUp(`\n**SORTEIO CANCELADO!**\nNão houve participantes no sorteio \`${premio}\`.`);

      let mensagemGanhadores = `**Parabéns aos ganhadores do sorteio ${premio}:**\n`;
      for (let ganhador of ganhadores) {
        mensagemGanhadores += `<@${ganhador}>\n`;
      }
      interaction.followUp(mensagemGanhadores);
    }, duracao);
  },
};
