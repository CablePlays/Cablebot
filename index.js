import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import url from 'url'

import { start } from './updater.js'

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ]
})

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/* Commands */

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

const commands = {}

for (const folder of commandFolders) {
    const folderPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file)
        const command = (await import(url.pathToFileURL(filePath).href)).default

        if ('data' in command && 'execute' in command) {
            commands[command.data.name] = command
        } else {
            console.warn(`The command at ${filePath} is missing a required "data" or "execute" property`)
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return

    const command = commands[interaction.commandName]

    if (!command) {
        console.warn(`No command matching "${interaction.commandName}" was found`)
        return
    }

    try {
        command.execute(interaction)
    } catch (error) {
        console.error(error)

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
        }
    }
})

/* Events */

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = (await import(url.pathToFileURL(filePath).href)).default

    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args))
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args))
    }
}

/* Login */

start(client)
client.login(process.env.TOKEN)