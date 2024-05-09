require('../index')

const Discord = require('discord.js')
const client = require('../index')

const salaAbertas = {};

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "tickets_basico") {
            const usuarioId = interaction.user.id;
            if (salaAbertas[usuarioId]) {
                interaction.reply({ content: `você já possui uma sala aberta.`, ephemeral: true });
                return;
            }

            // Crie a sala como antes
            let membro = await interaction.guild.members.fetch(interaction.user.id);
            let nome_usuario_servidor = membro? membro.displayName : interaction.user.username;
            let nome_canal = `🔖-${nome_usuario_servidor}`;
            let canal = interaction.guild.channels.cache.find(c => c.name === nome_canal);

            if (!canal) {
                // Crie a sala
                let categoria = interaction.channel.parent;
                if (!categoria) categoria = null;

                interaction.guild.channels.create({
                    name: nome_canal,
                    parent: categoria,
                    type: Discord.ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [ Discord.PermissionFlagsBits.ViewChannel ]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.AddReactions,
                                Discord.PermissionFlagsBits.SendMessages,
                                Discord.PermissionFlagsBits.AttachFiles,
                                Discord.PermissionFlagsBits.EmbedLinks
                            ]
                        },
                    ]
                }).then((chat) => {
                    salaAbertas[usuarioId] = chat;
                    interaction.reply({ content: `Olá **${nome_usuario_servidor}**, seu ticket foi aberto em ${chat}.`, ephemeral: true });

                    let embed = new Discord.EmbedBuilder()
                        .setColor("Random")
                        .setDescription(`Olá ${nome_usuario_servidor}, você abriu a Sua Pasta de Farme.\n\nAgora e so arrochar no farme e realizar o registro.`);

                    let botao_close = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("close_ticket")
                            .setEmoji("✖")
                            .setStyle(Discord.ButtonStyle.Danger),
                        new Discord.ButtonBuilder()
                            .setCustomId("week_goal")
                            .setEmoji("📅")
                            .setLabel("Meta da Semana")
                            .setStyle(Discord.ButtonStyle.Primary),
                        new Discord.ButtonBuilder()
                            .setCustomId("week_goal1")
                            .setEmoji("🛑")
                            .setLabel("Não Bateu a Meta")
                            .setStyle(Discord.ButtonStyle.Danger),
                        new Discord.ButtonBuilder()
                            .setCustomId("week_goal2")
                            .setEmoji("💚")
                            .setLabel("Bateu a Meta")
                            .setStyle(Discord.ButtonStyle.Primary)    
                    );

                    chat.send({ embeds: [embed], components: [botao_close] }).then(m => {
                    });
                });
            } else {
                interaction.reply({ content: `Seu Jagunço, você já possui uma sala em ${canal}.`, ephemeral: true });
            } 
            
        } else if (interaction.customId === "close_ticket") {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
                interaction.reply({ content: "Você não tem permissão para excluir esta sala.", ephemeral: true });
                return;
            }

            interaction.reply(`Olá ${interaction.user}, essa sala será excluído em 24 Horas.`);
            try {setTimeout(() => {
                    interaction.channel.delete().catch(e => { return; });
                    delete salaAbertas[interaction.user.id];
                }, 86400000);
            } catch (e) {
                return;
            }
        } if (interaction.customId === "week_goal") {
            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setTitle("Meta da Semana")
                .setDescription("Esta é a meta da semana para você:")
                .addFields(
                    { name: "**Produto:**", value: "Dinheiro Sujo" },
                    { name: "**Quantidade:**", value: "500k" }
                );

            interaction.reply({ embeds: [embed], ephemeral: true });
        } if (interaction.customId === "week_goal1") {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
                interaction.reply({ content: "Você não tem permissão para isso.", ephemeral: true });
                return;
            }
            
            interaction.reply(`Fala Jagunço, Parabenéns por ter batido a meta.\n\n**------------------------META NÃO FOI BATIDA------------------------\n\n ------------------------META RESETADA------------------------**\n\n**COLDOWN DE UMA AÇÃO POR NÃO BATER A META**`);
        

        } else if (interaction.customId === "week_goal2") {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
                interaction.reply({ content: "Você não tem permissão para isso.", ephemeral: true });
                return;
            }

            interaction.reply(`Fala Jagunço, Parabenéns por ter batido a meta.\n\n**------------------------META BATIDA------------------------\n\n ------------------------META RESETADA------------------------**`);
        }
    }
});