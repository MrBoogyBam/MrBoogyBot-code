const Discord = require('discord.js');
const config = require("./config.json");
const prefix = config.prefix;
const lmaoObamidSuck = config.lmaoObamidSuck;
const bot = new Discord.Client();
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
const botID = '705103167557337258';
const dogF = require('./src/commands/fun/dog.js');
const catF = require('./src/commands/fun/cat.js');
const randomwordF = require('./src/commands/fun/randomword.js');
const restartF = require('./src/commands/misc/restart.js');
const serverinfoF = require('./src/commands/useful/serverinfo.js');
const userinfoF = require('./src/commands/useful/userinfo.js');
const flipacoinF = require('./src/commands/fun/flipacoin.js');
const suggestF = require('./src/commands/misc/suggest.js');
const abcF = require('./src/commands/fun/abc.js');
const abcData = abcF.abcData;
const potF = require('./src/commands/useful/pot.js');
const rollF = require('./src/commands/fun/roll.js');
const invalidF = require('./src/commands/misc/invalid.js');
const rpsF = require('./src/commands/fun/rps.js');
const inspirationF = require('./src/commands/fun/inspiration.js');
const editedF = require('./src/commands/boring/edited.js');
const remindmeF = require('./src/commands/useful/remindme.js');
const guessF = require('./src/commands/fun/guess.js');
const sayF = require('./src/commands/fun/say.js');
const calculateF = require('./src/commands/useful/calculate.js');
const prefixF = require('./src/commands//misc/prefix.js');
const todoF = require('./src/commands/useful/todo.js');
const pingF = require('./src/commands/misc/ping.js');
const testF = require('./src/commands/misc/test.js');

// bot ready message
bot.on('ready', async () => {
    console.log(`${bot.user.username} is now online!\nLogs vvvv`);
    bot.user.setActivity(`${prefix}help on ${bot.guilds.cache.size} servers`, { type: "WATCHING" }).catch(console.error);
    let serverID =  await keyv.get('restart-server');
    let channelID = await keyv.get('restart-channel');
    let theChannel = bot.channels.resolve(channelID);
    let theMessage = await theChannel.messages.fetch(await keyv.get('restart-message'));
    if(serverID == undefined) return;
    theMessage.delete();
    const timeInMSCal = (new Date().getTime() - await keyv.get('restart-time'));
    const timeInSeconds = Math.floor(timeInMSCal / 1000);
    const timeInMS = timeInMSCal % 1000;
    if(timeInSeconds == 1) {
        theChannel.send(`Done! Bot restarted in ${timeInSeconds} second and ${timeInMS}ms`);
        return;
    }
    theChannel.send(`Done! Bot restarted in ${timeInSeconds} seconds and ${timeInMS}ms`);
    await keyv.delete('restart-server');
});

keyv.on('error', err => console.error('Keyv connection error:', err));

bot.on('message', async (message) => {
    if(message.author.bot) return;
    const args = message.content.substring(prefix.length).split(" ");
    args.shift();
    // test command
    if(message.content.toLowerCase() == `${prefix}test`) {
        await testF.testCmd(message);
        return;
    }
    // ping command
    if(message.content.toLowerCase() == `${prefix}ping`) {
        await pingF.pingCmd(message);
        return;
    }
    // pimg command
    if(message.content.toLowerCase() == `${prefix}pimg`) {
        await pingF.pimgCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}serverinfo`) {
        await serverinfoF.serverinfoCmd(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}userinfo`)) {
        await userinfoF.userinfoCmd(message);
        return;
    }
    // todo list command
    if(message.content.toLowerCase().startsWith(`${prefix}todo list`)) {
        await todoF.todoListCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}todo`) {
        await todoF.todoErr(message);
        return;
    }
    // todo add command
    if(message.content.toLowerCase().startsWith(`${prefix}todo add`)) {
        await todoF.todoAddCmd(message);
        return;
    }
    // todo remove command
    if(message.content.toLowerCase().startsWith(`${prefix}todo remove`)) {
        await todoF.todoRemoveCmd(message);
        return;
    }
    // todo private command
    if(message.content.toLowerCase() == `${prefix}todo private`) {
        await todoF.todoPrivateCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}prefix` || message.content.toLowerCase() == `<@!${botID}> prefix`) {
        await prefixF.prefixCmd(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}calculate`)) {
        await calculateF.calculateCmd(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}say`) == true) {
        await sayF.sayCmd(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}guessset`)) {
        await guessF.guesssetCmd(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}guess`)) {
        await guessF.guessCmd(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}remindme`)) {
        await remindmeF.remindmeCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}edited`) {
        await editedF.editedCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}inspiration`) {
        await inspirationF.inspirationCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}rps`) {
        await rpsF.rpsCmd(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}flip a coin`)) {
        await flipacoinF.flipacoinCmd(message);
        return
    }
    if(message.content.toLowerCase().startsWith(`${prefix}suggest`)) {
        await suggestF.suggestCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}abc`) {
        await abcF.abcCmd(message);
        return;
    }
    if(abcData.ABCType == true) {
        if(message.content.toLowerCase() == `abcdefghijklmnopqrstuvwxyz`) {
            await abcF.abcCmd2(message);
            return;
        }
    }
    if(message.content.toLowerCase() == `${prefix}pot`) {
        await potF.potCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}potdownload` || message.content.toLowerCase() == `${prefix}pot download`) {
        await potF.potDownloadsF(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}pot instructions` || message.content.toLowerCase() == `${prefix}potinstructions`) {
        await potF.potInstructionsF(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}potdownload instructions` || message.content.toLowerCase() == `${prefix}pot download instructions`) {
        await potF.potHowToDownloadF(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}modpackdownload` || message.content.toLowerCase() == `${prefix}modpack download`) {
        await potF.modpackDownloadF(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}modpackdownload instructions` || message.content.toLowerCase() == `${prefix}modpack download instructions`) {
        await potF.modpackHowToDownloadF(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}roll`)) {
        await rollF.rollCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}dog`) {
        await dogF.dogCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}cat`) {
        await catF.catCmd(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}randomword` || message.content.toLowerCase() == `${prefix}random word`) {
        await randomwordF.randomwordCmd(message);
        return;
    }
    if(message.content.toLowerCase() == await keyv.get('random-word'+message.channel.id)) {
        await randomwordF.randomwordW(message);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}restart`) {
        await restartF.restartCmd(message);
    }
    // help command
    if(message.content.toLowerCase().startsWith(`${prefix}help`)) {
        if(message.content.toLowerCase() == `${prefix}help`) {
            const helpTitle = `\n__**${bot.user.username}**__\n\n`;
            const miscH = `**${prefix}help misc** - misc commands\n`;
            const funH = `**${prefix}help fun** - fun commands\n`;
            const usefulH = `**${prefix}help useful** - useful commands\n`;
            const boringH = `**${prefix}help boring** - boring commands`;
            message.reply(`${helpTitle}${miscH}${funH}${usefulH}${boringH}`);
            return;
        }
        if(message.content.toLowerCase() == `${prefix}help misc`) {
            const helpTitle = `\n__**${bot.user.username} misc commands:**__\n\n`;
            const testH = `**${prefix}help test**\n`;
            const prefixH = `**${prefix}help prefix**\n`;
            const pingH = `**${prefix}help ping**\n`;
            const suggestH = `**${prefix}help suggest**`;
            message.reply(`${helpTitle}${testH}${prefixH}${pingH}${suggestH}`);
            return;
        }
        if(message.content.toLowerCase() == `${prefix}help fun`) {
            const helpTitle = `\n__**${bot.user.username} fun commands:**__\n\n`;
            const dogH = `**${prefix}help dog**\n`;
            const catH = `**${prefix}help cat**\n`;
            const randomwordH = `**${prefix}help randomword**\n`;
            const flipacoinH = `**${prefix}help flipacoin**\n`;
            const guessH = `**${prefix}help guess**\n`;
            const rollH = `**${prefix}help roll**\n`;
            const rpsH = `**${prefix}help rps**\n`;
            const sayH = `**${prefix}help say**\n`;
            const inspirationH = `**${prefix}help inspiration**\n`;
            const abcH = `**${prefix}help abc**`;
            message.reply(`${helpTitle}${dogH}${catH}${randomwordH}${flipacoinH}${guessH}${rollH}${rpsH}${sayH}${inspirationH}${abcH}`);
            return;
        }
        if(message.content.toLowerCase() == `${prefix}help useful`) {
            const helpTitle = `\n__**${bot.user.username} useful commands:**__\n\n`;
            const remindmeH = `**${prefix}help remindme**\n`;
            const todoH = `**${prefix}help todo**\n`;
            const calculateH = `**${prefix}help calculate**\n`;
            const serverinfoH = `**${prefix}help serverinfo**\n`;
            const userinfoH = `**${prefix}help userinfo**\n`;
            const potH = `**${prefix}help pot**\n`;
            return;
        }
        if(message.content.toLowerCase() == `${prefix}help boring`) {
            const helpTitle = `\n__**${bot.user.username} boring commands**__\n\n`;
            const editedH = `**${prefix}help edited**`;
            message.reply(`${helpTitle}${editedH}`);
            return;
        }
        const helpMsg = message.content.toLowerCase().substring(8);
        const testH = `\n__**Test command:**__\nA command to check if the bot is working.`;
        const prefixH = `\n__**Prefix command:**__\nTells you the bot's prefix.`;
        const pingH = `\n__**Ping command:**__\nShows you the bot's latency.`;
        const suggestH = `\n__**Suggest command:**__\nSends a suggestion to the creator of the bot.\n\n__**For example:**__\n\`${prefix}suggest ${prefix}dog - a command that sends a random image of a dog.\``;
        const dogH = `\n__**Dog command:**__\nSends a random image of a dog.`;
        const catH = `\n__**Cat command:**__\nSends a random image of a cat.`;
        const randomwordH = `\n__**Randomword command:**__\nSends a random word that you have to type out.`;
        const flipacoinH = `\n__**Flip a coin command:**__\nFlips a coin, you can also pick heads or tails.`;
        const guessCmds = `\n__**Guess commands:**__\n\n**${prefix}help guess2**\n**${prefix}help guessset**`;
        const guesssetH = `\n__**Guessset command:**__\nSet a random number to guess with the \`${prefix}guess\` command.\n\n__**For example**__\n\`${prefix}guessset 3/75\``;
        const guessH = `\n__**Guess command:**__\nGuess the number you set with \`${prefix}guessset\`.`;
        const rollH = `\n__**Roll command:**__\nRolls a random number that you set.\n\n__**For example**__\n\`${prefix}roll 5/69\``;
        const rpsH = `\n__**Rps command:**__\nRock paper scissors.`;
        const sayH = `\n__**Say command:**__\nMake the bot say something.`;
        const inspirationH = `\n__**Inspiration command:**__\nSends a funny random inspiration.`;
        const abcH = `\n__**Abc command:**__\nType the English Alphabet as fast as you can.`;
        const remindmeH = `\n__**Remindme command:**__\nSets a reminder.\n\n__**For example:**__\n\`${prefix}remindme 3 minutes\``;
        const todoH = `\n__**Todo commands:**__\n\n**${prefix}todo list**\n**${prefix}todo add**\n**${prefix}todo remove**\n**${prefix}todo private**`;
        const calculateH = `\n__**Calculate command:**__\nSimple calculator.`;
        const serverinfoH = `\n__**Serverinfo command:**__\nShows you information about the server.`;
        const userinfoH = `\n__**Userinfo command:**__\nShows you information about a user.\n\n__**For example:**__\n\`${prefix}userinfo 705103167557337258\``;
        const potH = `\n__**Pot command:**__\nShows you how to install potPNG mod for getting over it.`;
        const editedH = `\n__**Edited command:**__\ni edited this message.`;

        if(helpMsg == 'edited') {
            message.reply(editedH);
            return;
        }
        if(helpMsg == `pot`) {
            message.reply(potH);
            return;
        }
        if(helpMsg == `userinfo`) {
            message.reply(userinfoH);
            return;
        }
        if(helpMsg == `serverinfo`) {
            message.reply(serverinfoH);
            return;
        }
        if(helpMsg == `calculate`) {
            message.reply(calculateH);
            return;
        }
        if(helpMsg == `todo`) {
            message.reply(todoH);
            return;
        }
        if(helpMsg == `remindme`) {
            message.reply(remindmeH);
            return;
        }
        if(helpMsg == `abc`) {
            message.reply(abcH);
            return;
        }
        if(helpMsg == `inspiration`) {
            message.reply(inspirationH);
            return;
        } 
        if(helpMsg == `say`) {
            message.reply(sayH);
            return;
        }
        if(helpMsg == `rps`) {
            message.reply(rpsH);
            return;
        }
        if(helpMsg == `roll`) {
            message.reply(rollH);
            return;
        }
        if(helpMsg == `guess2`) {
            message.reply(guessH);
            return;
        }
        if(helpMsg == `guessset`) {
            message.reply(guesssetH);
            return;
        }
        if(helpMsg == `guess`) {
            message.reply(guessCmds);
            return;
        }
        if(helpMsg == `flipacoin`) {
            message.reply(flipacoinH);
            return;
        }
        if(helpMsg == `randomword`) {
            message.reply(randomwordH);
            return;
        }
        if(helpMsg == `cat`) {
            message.reply(catH);
            return;
        }
        if(helpMsg == `dog`) {
            message.reply(dogH);
            return;
        }
        if(helpMsg == `test`) {
            message.reply(testH);
            return;
        }
        if(helpMsg == `prefix`) {
            message.reply(prefixH);
            return;
        } 
        if(helpMsg == `ping`) {
            message.reply(pingH);
            return;
        }
        if(helpMsg == `suggest`) {
            message.reply(suggestH);
            return;
        }
    }
    if(message.content.toLowerCase().startsWith(`${prefix}`)) {
        await invalidF.invalidErr(message);
        return;
    }
});

// logs
bot.on('message', async (message) => {
    if(message.content) {
        if(message.channel.type == "dm") {
            console.log(`(In DMs) ${message.author.username}: ${message.content}`);
            return;
        }
        console.log(`(In ${message.guild.name}, #${message.channel.name}) ${message.author.username}: ${message.content}`);
    }
});

// logs (if message is edited)
bot.on('messageUpdate', (newMessage, oldMessage) => {
    if(oldMessage.channel.type == "dm") {
        console.log(`(EDITED)(In DMs) ${oldMessage.author.username}: ${oldMessage.content}\n(Old Message) ${oldMessage.author.username}: ${newMessage}`);
        return;
    }
    console.log(`(EDITED)(In ${oldMessage.guild.name}, #${oldMessage.channel.name}) ${oldMessage.author.username}: ${oldMessage.content}\n(Old Message) ${oldMessage.author.username}: ${newMessage}`);
});

// logs (if message is deleted)
bot.on('messageDelete', DeletedMessage => {
    if(DeletedMessage.channel.type == "dm") {
        console.log(`(DELETED)(In DMs) ${DeletedMessage.author.username}: ${DeletedMessage.content}`);
        return;
    }
    console.log(`(DELETED)(In ${DeletedMessage.guild.name}, #${DeletedMessage.channel.name}) ${DeletedMessage.author.username}: ${DeletedMessage.content}`);
});

// bot login
bot.login(lmaoObamidSuck);