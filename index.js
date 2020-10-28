const Discord = require('discord.js'),
    client = new Discord.Client(),
    config = require('./config.json'),
    fs = require('fs')
 
client.login(config.token)
client.commands = new Discord.Collection()
 
fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})
 
client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
 
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    command.run(message, args, client)
})

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member} a rejoint le serveur. Nous sommes désormais ${member.guild.memberCount} ! 🎉`)
    member.roles.add(config.greeting.role)
})
 
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member.user.tag} a quitté le serveur... 😢`)
})

client.on('ready', () => {
   client.user.setActivity('Bot By pixel_M ', {type: 'PLAYING'})
})
setInterval(() => {
    const [bots, humans] = client.guilds.cache.first().members.cache.partition(member => member.user.bot)
    client.channels.cache.get(config.serverStats.humans).setName(`😀|Humains|😀: ${humans.size}`)
        client.channels.cache.get(config.serverStats.bots).setName(`🤖|Bots|🤖 : ${bots.size}`)
        client.channels.cache.get(config.serverStats.total).setName(`👌|Total|👌 : ${client.guilds.cache.first().memberCount}`)
}, 3e4)

