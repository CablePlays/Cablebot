import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { forEachUser } from '../../user-data.js'

export default {
    data: new SlashCommandBuilder()
        .setName('fleaderboard')
        .setDescription('Shows the top f spammers'),
    async execute(interaction) {
        const { client } = interaction
        const fcounts = []

        await interaction.deferReply()

        forEachUser((userId, db) => {
            fcounts.push({ userId, count: db.get('fCount') })
        })

        fcounts.sort((a, b) => b.count - a.count)

        const embed = new EmbedBuilder()
            .setColor(0x0080ff)
            .setTitle('THE F LEADERBOARD')
            .setDescription('Here are the top f spammers:')

        for (let i = 0; i < Math.min(10, fcounts.length); i++) {
            const { userId, count } = fcounts[i]

            const user = await client.users.fetch(userId)

            embed.addFields({
                name: `#${i + 1}  •  ${user.globalName}`,
                value: `f x ${count}`
            })
        }

        await interaction.editReply({ embeds: [embed] })
    }
}