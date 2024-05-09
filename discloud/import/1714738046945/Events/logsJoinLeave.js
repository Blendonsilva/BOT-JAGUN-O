require('../index')

const Discord = require('discord.js')
const client = require('../index')

client.on("guildMemberAdd", (member) => {
  let canal_logs = "814270561592672326";
    if (!canal_logs) return;
  
    let embed = new Discord.EmbedBuilder()
    .setColor("Green")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTitle("👋 Boas Vindas!")
    .setDescription(`> Olá ${member}!\nSeja Bem-Vindo(a) ao servidor \`${member.guild.name}\`!\nAtualmente estamos com \`${member.guild.memberCount}\` membros.`);
  
    member.guild.channels.cache.get(canal_logs).send({ embeds: [embed] }) // Caso queira que o usuário não seja mencionado, retire a parte do "content".
  })
  
  client.on("guildMemberRemove", (member) => {
    let canal_logs = "814270561592672326"; // Coloque o ID do canal de texto
    if (!canal_logs) return;
  
    let embed = new Discord.EmbedBuilder()
    .setColor("Red")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTitle(`Adeus ${member.user.username}....`)
    .setDescription(`> O usuário ${member} saiu do servidor!\n> 😓 Espero que retorne um dia.\n> Nos sobrou apenas \`${member.guild.memberCount}\` membros.`);
  
    member.guild.channels.cache.get(canal_logs).send({ embeds: [embed], content: `${member}` }) // Caso queira que o usuário não seja mencionado, retire a parte do "content". 
})

// Função para limpar a última mensagem de boas-vindas enviada pelo bot
function limparMensagemBoasVindas() {
  let canal_logs = "814270561592672326"; // ID do canal onde o bot envia as mensagens
  if (!canal_logs) return;

  const channel = client.channels.cache.get(canal_logs);
  if (!channel) return;

  channel.messages.fetch({ limit: 100 }).then(messages => {
    const botMessages = messages.filter(msg => msg.author.id === client.user.id && msg.content.startsWith('>'));
    if (botMessages.size > 0) {
      // Remove a última mensagem de boas-vindas enviada pelo bot
      botMessages.first().delete().catch(console.error);
    }
  }).catch(console.error);
}

// Executa a função limparMensagemBoasVindas a cada 24 horas (86400000 milissegundos)
setInterval(limparMensagemBoasVindas, 10000);
