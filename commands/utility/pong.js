import {  SlashCommandBuilder } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('pong')
        .setDescription('Replies with Ping!'),
    async execute(interaction) {
        await interaction.reply('Ping!')
    }
}