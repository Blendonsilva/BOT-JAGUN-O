// const Discord = require("discord.js")

// module.exports = {
//   name: "ticket", // Coloque o nome do comando
//   description: "Abra o painel de tickets.", // Coloque a descrição do comando
//   type: Discord.ApplicationCommandType.ChatInput,

//   run: async (client, interaction) => {

//     if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
//         interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true })
//     } else {
//         let embed = new Discord.EmbedBuilder()
//         .setColor("Random")
//         .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
//         .setDescription(`Abra um ticekt aqui no servidor selecionando uma das opções abaixo:`);

//         let painel = new Discord.ActionRowBuilder().addComponents(
//             new Discord.SelectMenuBuilder()
//             .setCustomId("painel_ticket")
//             .setPlaceholder("Clique aqui!")
//             .addOptions(
//                 {
//                     label: "Opção 1",
//                     description: "Abra um ticket na opção 1.",
//                     value: "opc1"
//                 },
//                 {
//                     label: "Opção 2",
//                     description: "Abra um ticket na opção 2.",
//                     value: "opc2"
//                 },
//                 {
//                     label: "Opção 3",
//                     description: "Abra um ticket na opção 3.",
//                     value: "opc3"
//                 }
//             )
//         );

//         interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true })
//         interaction.channel.send({ embeds: [embed], components: [painel] })
//     }


//   }
// }


// let botao_close = new Discord.ActionRowBuilder().addComponents(
//     new Discord.ButtonBuilder()
//         .setCustomId("close_ticket")
//         .setEmoji("✖")
//         .setStyle(Discord.ButtonStyle.Danger),
//     new Discord.ButtonBuilder()
//         .setCustomId("week_goal")
//         .setEmoji("📅")
//         .setLabel("Meta da Semana")
//         .setStyle(Discord.ButtonStyle.Primary),
//     new Discord.ButtonBuilder()
//         .setCustomId("week_goal1")
//         .setEmoji("🛑")
//         .setLabel("Não Bateu a Meta")
//         .setStyle(Discord.ButtonStyle.Danger),
//     new Discord.ButtonBuilder()
//         .setCustomId("week_goal2")
//         .setEmoji("💚")
//         .setLabel("Bateu a Meta")
//         .setStyle(Discord.ButtonStyle.Primary)    
// );

// chat.send({ embeds: [embed], components: [botao_close] }).then(m => {
// });