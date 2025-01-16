import { Events } from 'discord.js'
import { getDatabase } from '../data.js'
import { get as getUserData } from '../user-data.js'

const emojis = ['🫓', '🍅', '🥬', '🥓']
const spamRoles = {
    '1327731264937132134': 1000,
    '1327731352019140639': 5000,
    '1327731730517590077': 20000,
    '1327731409590423625': 100000
}

let messagesToGo = 50

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

function getResponses(message) {
    const responses = getDatabase().get('responses') ?? []
    const phrase = simplifyPhrase(message)

    for (let group of responses) {
        if (group.phrase === phrase) {
            return group.responses
        }
    }

    return [
        "I don't know how to respond to that.",
        "I don't know what to say.",
        "Unlucky, that's a phrase I don't know.",
        "Maybe try say something else.",
        "Huh?",
        "???"
    ]
}

export default {
    name: Events.MessageCreate,
    async execute(client, message) {
        const { author, guild } = message
        if (author.bot) return

        const content = message.content.replaceAll('<@1327358817008353301>', '').trim()

        if (content === 'f') {
            const udb = getUserData(author.id)
            const newCount = (udb.get('fCount') ?? 0) + 1
            udb.set('fCount', newCount)
            message.reply(`You have said "f" ${newCount} time${newCount === 1 ? '' : 's'}!`)

            const member = await guild.members.fetch(author.id)
            const roles = member.roles.cache

            let highestRoleId = null

            for (let roleId in spamRoles) {
                if (newCount < spamRoles[roleId]) break
                highestRoleId = roleId
            }

            if (highestRoleId && !roles.has(highestRoleId)) {
                for (let roleId in spamRoles) {
                    await member.roles.remove(roleId)
                }

                await member.roles.add(highestRoleId)


                message.reply(`You earned the <@&${highestRoleId}> role for spamming!`)
            }
        } else if (message.mentions.has(client.user)) {
            const responses = getResponses(content)
            message.reply(responses[Math.floor(Math.random() * responses.length)])
        } else if (--messagesToGo <= 0) {
            messagesToGo = 50
            message.reply('Hello.')
        }

        if (Math.random() < 0.1 && false) {
            try {
                await message.react(emojis[Math.floor(Math.random() * emojis.length)])
            } catch (error) {
                console.error(error)
            }
        }
    }
}