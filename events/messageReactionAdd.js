import { Events } from 'discord.js'

export default {
    name: Events.MessageReactionAdd,
    execute(client, reaction, user) {
        if (user.bot) return
        
        console.log('message reaction add')
    }
}