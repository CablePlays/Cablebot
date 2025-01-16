import { REST, Routes } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import url from 'url'

dotenv.config()

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

const commands = []

for (const folder of commandFolders) {
    const folderPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file)
        const command = (await import(url.pathToFileURL(filePath).href)).default

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON())
        } else {
            console.warn(`The command at ${filePath} is missing a required "data" or "execute" property`)
        }
    }
}

const rest = new REST().setToken(process.env.TOKEN)

async function deploy() {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands`)
        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
        console.log(`Successfully reloaded ${data.length} application (/) commands`)
    } catch (error) {
        console.error(error)
    }
}

deploy()