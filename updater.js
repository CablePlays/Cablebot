const channelId = '1327392290607730809'
const guildId = '1323901737094086656'

let client

async function getChannel() {
    return client.channels.cache.get(channelId) ?? await client.channels.fetch(channelId)
}

async function getGuild() {
    return client.guilds.cache.get(guildId) ?? await client.guilds.fetch(guildId)
}

async function run() {
    const guild = await getGuild()
    const onlineMembers = (await guild.members.fetch()).filter(member => !member.user.bot && ['online', 'idle', 'dnd'].includes(member.presence?.status))
    const totalOnline = onlineMembers.size

    const channel = await getChannel()
    console.info(`Updating online count: ${totalOnline}`)
    await channel.setName(`🟢 Online: ${totalOnline}`)
}

export function start(c) {
    client = c
    setInterval(() => {
        run().catch(console.error)
    }, 120 * 1000)
}