const Discord = require('discord.js');
const bot = new Discord.Client;
const config = require('../../../config.json');
const prefix = config.prefix;

async function userinfoCmd(message) {
    const userInfoEmbed = new Discord.MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle('User information')
            .setAuthor(message.author.username, message.author.avatarURL())
            .setDescription(`User tag: ${message.author.tag}\nUser ID: ${message.author.id}\nCreated at: ${message.author.createdAt.toUTCString()}`)
            .setImage(message.author.avatarURL())
            .setThumbnail(message.author.avatarURL())
            .setTimestamp();
        if(message.content.toLowerCase() == `${prefix}userinfo`) {
            message.channel.send(userInfoEmbed);
            return;
        }
        const MsgUsrID = message.content.substring(12);
        const UserID = bot.users.resolve(`${MsgUsrID}`)
        if(UserID == null) {
            message.reply(':x: User was not found.');
            return;
        }
        const userInfoEmbedID = new Discord.MessageEmbed()
            .setColor(UserID.displayHexColor)
            .setTitle('User information')
            .setAuthor(UserID.username, UserID.avatarURL())
            .setDescription(`User tag: ${UserID.tag}\nUser ID: ${UserID.id}\nCreated at: ${UserID.createdAt.toUTCString()}`)
            .setImage(UserID.avatarURL())
            .setThumbnail(UserID.avatarURL())
            .setTimestamp();
        message.channel.send(userInfoEmbedID);
        return;
}

module.exports.userinfoCmd = userinfoCmd;