const Discord = require('discord.js');

async function serverinfoCmd(message) {
    if(message.channel.type == 'dm') {
        message.channel.send(`Sorry, this command can only work in a server.`);
        return;
    }
    const serverInfoEmbed = new Discord.MessageEmbed()
        .setColor(`#00ffff`)
        .setTitle('Server information')
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nServer ID: ${message.guild.id}\nCreated at: ${message.guild.createdAt.toUTCString()}`)
        .setImage(message.guild.iconURL())
        .setThumbnail(message.guild.iconURL())
        .setTimestamp();
    message.channel.send(serverInfoEmbed);
    return;
}

module.exports.serverinfoCmd = serverinfoCmd;