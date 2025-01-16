import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows you everything you can do with the bot'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0080ff)
            .setTitle('Things I Can Do')
            .setDescription('Here are some of the things I can do:')
            .addFields(
                { name: 'Ping, pong!', value: 'I will reply to `/ping` and `/pong`' },
                { name: 'F Counter', value: 'I count how many times you say `f`' },
                { name: 'Training', value: "Train me by using `/response`. Then, when you mention me and say that phrase, I'll respond how you told me to." }
            )

        await interaction.reply({ embeds: [embed] })
    }
}