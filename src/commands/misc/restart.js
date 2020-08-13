const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
const myID = '368115473310547969';

async function restartCmd(message) {
    if(message.author.id !== `${myID}` && message.author.id !== '388027536417882124' && message.author.id !== '341076015663153153') {
        message.reply(`Only the creator of the bot can use this command.`);
        return;
    }
    await keyv.set('restart-message', (await message.channel.send('Restarting... <a:loading:721573242686668861>')).id);
    await keyv.set('restart-time', new Date().getTime());
    await keyv.set('restart-server', message.guild.id);
    await keyv.set('restart-channel', message.channel.id);
    process.exit(0);
}

module.exports.restartCmd = restartCmd;