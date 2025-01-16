import { SlashCommandBuilder } from 'discord.js'
import { getDatabase } from '../../data.js'

function simplifyPhrase(phrase) {
    return phrase.replaceAll("'", '')
        .replaceAll('`', '')
        .replaceAll('.', '')
        .replaceAll('!', '')
        .replaceAll('?', '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim()
}

export default {
    data: new SlashCommandBuilder()
        .setName('response')
        .setDescription('Adds a response to a specific phrase')
        .addStringOption(option => option
            .setName('phrase')
            .setDescription('The phrase that I will respond to')
            .setRequired(true)
        ).addStringOption(option => option
            .setName('response')
            .setDescription('How I will reply to the given phrase')
            .setRequired(true)
        ),
    async execute(interaction) {
        const { options } = interaction
        const phrase = simplifyPhrase(options.getString('phrase'))
        const response = options.getString('response')

        const db = getDatabase()
        const responses = db.get('responses') ?? []
        let existing = false

        for (let group of responses) {
            const { phrase: groupPhrase, responses: groupResponses } = group

            if (groupPhrase === phrase) {
                groupResponses.push(response)
                existing = true
                break
            }
        }

        if (!existing) {
            responses.push({
                phrase,
                responses: [response]
            })
        }

        db.set('responses', responses)
        interaction.reply(`I will now reply with \`${response}\` to the phrase \`${options.getString('phrase')}\``)
    }
}