const Discord = require('discord.js');
const config = require("./config.json");
const prefix = config.prefix;
const lmaoObamidSuck = config.lmaoObamidSuck;
const bot = new Discord.Client();
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
const botID = '705103167557337258';
const check = ':white_check_mark:';
const functionsF = require('./src/functions.js');
const dogF = require('./src/commands/fun/dog.js');
const catF = require('./src/commands/fun/cat.js');
const randomwordF = require('./src/commands/fun/randomword.js');
const restartF = require('./src/commands/misc/restart.js');
const serverinfoF = require('./src/commands/useful/serverinfo.js');
const userinfoF = require('./src/commands/useful/userinfo.js');
const flipacoinF = require('./src/commands/fun/flipacoin.js');
const suggestF = require('./src/commands/misc/suggest.js');
const reportbugF = require('./src/commands/useful/report.js');
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
const badErr = functionsF.badErr;

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
        message.reply(`${check} It works!`);
        return;
    }
    // ping command
    if(message.content.toLowerCase() == `${prefix}ping`) {
        const msg = await message.channel.send('🏓Pinging...');
        msg.edit(`🏓Pong!\nLatency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`);
        return;
    }
    // pimg command
    if(message.content.toLowerCase() == `${prefix}pimg`) {
        const msgpimg = await message.channel.send('🏓Pimgimg...');
        msgpimg.edit(`🏓Pomg!\nLatemcy is ${Math.floor(msgpimg.createdTimestamp - message.createdTimestamp)}ms`);
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
        if(message.content.toLowerCase() == `${prefix}todo list`) {
            let todoList = await keyv.get('todo-list'+message.author.id);
            let todoPrivate = await keyv.get('todo-private'+message.author.id);
            if(todoPrivate == true) {
                bot.users.resolve(message.author.id).send(`**__${message.author.username}'s todo list:__**\n`+todoList.map((item, i) => (i + 1) + ". " + item).join("\n"), {split: true});
                message.reply(`I've sent you a DM with your todo list.`);
                return;
            }
            if(todoList == undefined) {
                todoList = [];
            }
            if(todoList.length == 0) {
                message.reply(':x: Your todo list is empty. You can add todos to your todo list with `mb!todo add`');
                return;
            }
            message.channel.send(`**__${message.author.username}'s todo list:__**\n`+todoList.map((item, i) => (i + 1) + ". " + item).join("\n"), {split: true});
            return;
        }
        let todoUserID = message.content.substring(13);
        let todoUser = bot.users.resolve(todoUserID);
        if(todoUser == null) {
            badErr(message);
            return;
        }
        let todoPrivate = await keyv.get('todo-private'+todoUser.id);
        if(todoUser == undefined) {
            badErr(message);
            return;
        }
        if(todoUser == message.author.id) {
            if(todoPrivate == true) {
                let todoList = await keyv.get('todo-list'+todoUser.id);
                if(todoList.length == 0) {
                    message.reply(':x: Your todo list is empty. You can add todos to your todo list with `mb!todo add`');
                    return;
                }
                bot.users.resolve(message.author.id).send(`**__${message.author.username}'s todo list:__**\n`+todoList.map((item, i) => (i + 1) + ". " + item).join("\n"), {split: true});
                message.reply(`I've sent you a DM with your todo list.`);
                return;
            } else {
                message.channel.send(`**__${message.author.username}'s todo list:__**\n`+todoList.map((item, i) => (i + 1) + ". " + item).join("\n"), {split: true});
                return;
            }
        }
        if(todoPrivate == true) {
            message.reply(`:x: ${todoUser.username}'s todo list is private.`);
            return;
        }
        let todoList = await keyv.get('todo-list'+todoUser.id);
        if(todoList == undefined) {
            message.reply(`:x: ${todoUser.username}'s todo list is empty.`);
            return;
        }
        message.channel.send(`**__${todoUser.username}'s todo list:__**\n`+todoList.map((item, i) => (i + 1) + ". " + item).join("\n"), {split: true});
        return;
    }
    if(message.content.toLowerCase() == `${prefix}todo`) {
        message.reply(`\`${prefix}todo\` is not a command, type \`${prefix}help todo\` for a list of todo commands.`);
        return;
    }
    // todo add command
    if(message.content.toLowerCase().startsWith(`${prefix}todo add`)) {
        if(message.content.toLowerCase() == `${prefix}todo add`) {
            badErr(message);
            return;
        }
        let todoList = await keyv.get('todo-list'+message.author.id);
        let todoMsg = message.content.substring(12);
        if(todoList == undefined) {
            todoList = [];
        }
        todoList.push(todoMsg);
        message.reply(`${check} Done.`);
        await keyv.set('todo-list'+message.author.id, todoList);
        return;
    }
    // todo remove command
    if(message.content.toLowerCase().startsWith(`${prefix}todo remove`)) {
        let todoMsg = message.content.substring(15);
        let todoList = await keyv.get('todo-list'+message.author.id);
        let indexToRemove = todoList.indexOf( todoMsg );
        if(todoList.length == 0) {
            message.reply(':x: There is nothing to remove from your todo list.');
            return;
        }
        if(indexToRemove == -1) {
            indexToRemove = parseInt(todoMsg, 10) - 1;
        }
        if(indexToRemove < 0 || indexToRemove >= todoList.length || isNaN(indexToRemove)) {
            badErr(message);
            return;
        }
        todoList.splice(indexToRemove, 1);
        await keyv.set('todo-list'+message.author.id, todoList);
        message.reply(`${check} Done.`);
        return;
    }
    // todo private command
    if(message.content.toLowerCase() == `${prefix}todo private`) {
        let todoPrivate = await keyv.get('todo-private'+message.author.id);
        if(todoPrivate == undefined) {
            todoPrivate = false;
        }
        if(todoPrivate == false) {
            todoPrivate = true;
        } else {
            todoPrivate = false;
        }
        await keyv.set('todo-private'+message.author.id, todoPrivate);
        if(todoPrivate == true) {
            message.reply(`${check} Done, your todo list is now private.`);
            return;
        }
        if(todoPrivate == false) {
            message.reply(`${check} Done, your todo list is now public.`);
            return;
        }
        return;
    }
    // prefix command
    if(message.content.toLowerCase() == `${prefix}prefix` || message.content.toLowerCase() == `<@!${botID}> prefix`) {
        message.reply(`The prefix is \`${prefix}\``);
        return;
    }
    // calculate command
    if(message.content.toLowerCase().startsWith(`${prefix}calculate`)) {
        await calculateF.calculateCmd(message);
        return;
    }
    // say command
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
    // card jitsu command
    if(message.content.toLowerCase() == `${prefix}cardjitsu` || message.content.toLowerCase() == `${prefix}card jitsu`) {
        let cards = [ "fire", "water", "ice" ];
        let cardNumbers = [ "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ];
    }
    if(message.content.toLowerCase().startsWith(`${prefix}flip a coin`)) {
        await flipacoinF.flipacoinCmd(message);
        return
    }
    if(message.content.toLowerCase().startsWith(`${prefix}suggest`)) {
        await suggestF.suggestCmd(message);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}reportbug` || message.content.toLowerCase() == `${prefix}bugreport` || message.content.toLowerCase() == `${prefix}report bug` || message.cotnent.toLowerCase() == `${prefix}bug report`)) {
        await reportbugF.reportbugCmd(message);
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
            const commandsHelp = `\n**Some of the commands were deleted**\n\n__**Type \`${prefix}help command\` to see what the command does.**__\n`;
            const botPrefix = `**${prefix}** - Bot's prefix\n\n`;
            const pingCmd = `**${prefix}ping**\n`;
            const infoCmds = `**${prefix}info**\n`;
            const sayCmd = `**${prefix}say**\n`;
            const suggestCmd = `**${prefix}suggest**\n`;
            const bugReportCmd = `**${prefix}reportbug**\n`;
            const potCmd = `**${prefix}pot**\n`;
            const rollCmd = `**${prefix}roll**\n`;
            const flipACoinCmd = `**${prefix}flip a coin**\n`;
            const todoCmds = `**${prefix}todo**\n`;
            const guessCmds = `**${prefix}guess**\n`;
            const calculateCmd = `**${prefix}calculate**\n`;
            const dogCmd = `**${prefix}dog**\n`;
            message.reply(`${commandsHelp}${botPrefix}${pingCmd}${infoCmds}${sayCmd}${suggestCmd}${bugReportCmd}${potCmd}${rollCmd}${flipACoinCmd}${todoCmds}${guessCmds}${calculateCmd}${dogCmd}`);
            return;
        }
        let helpMsg = message.content.substring(8);
        const typeHelp = `\n__**Type \`${prefix}help command\` to see what the command does.**__\n`;
        const todoHelp = `${typeHelp}**__${prefix}todo commands__**\n\n**${prefix}todo list**\n**${prefix}todo add**\n**${prefix}todo remove**\n**${prefix}todo clear**\n**${prefix}todo private**\n**${prefix}todo check**`;
        const quoteHelp = `${typeHelp}**__${prefix}quote commands__**\n\n**${prefix}quote request**\n**${prefix}quote**`;
        const guessHelp = `${typeHelp}**__${prefix}guess commands__**\n\n**${prefix}guessset**\n**${prefix}guess**`;
        const infoHelp = `${typeHelp}**__${prefix}info commands__**\n\n**${prefix}serverinfo**\n**${prefix}userinfo**`;
        const pingHelp = `\n__**${prefix}ping**__\nShows you the ping of the bot.`;
        const sayHelp = `\n**__${prefix}say__**\nThe bot will say what you told him to say.\nFor example:\n\`${prefix}say test\`\n\`bot: test\``;
        const suggestHelp = `\n__**${prefix}suggest**__\nThe bot will send the creator of the bot your suggestion.\nFor example:\n\`${prefix}suggest make a todo list command\``;
        const bugReportHelp = `\n__**${prefix}reportbug**__\nThe bot will send the creator of the bot your bug report.\nFor example:\n\`${prefix}reportbug mb!roll is not working.\``;
        const potHelp = `\n__**${prefix}pot**__\nShows you how to install potPNG mod.`;
        const rollHelp = `\n__**${prefix}roll**__\nRolls a number between a range you choose.\nFor example:\n\`${prefix}roll ${Math.floor((Math.random() * 10) + 1)}/${Math.floor((Math.random() * 100) + 10)}\``;
        const flipACoinHelp = `\n__**${prefix}flip a coin**__\nFlips a coin.\nFor example:\n\`${prefix}flip a coin heads\`\n\`bot: It's tails, you lose.\`\nor\n\`${prefix}flip a coin\`\n\`bot: The coin landed on heads.\``;
        const userinfoHelp = `\n__**${prefix}userinfo**__\nShows information about your account, you can also use it on other people.\nFor example:\n\`${prefix}userinfo 368115473310547969\``;
        const serverinfoHelp = `\n__**${prefix}serverinfo**__\nShows information about the server.`;
        const guesssetHelp = `\n__**${prefix}guessset**__\nSet a range for \`${prefix}guess\`.\nFor example:\n\`${prefix}guessset ${Math.floor((Math.random() * 10) + 1)}/${Math.floor((Math.random() * 100) + 10)}\``;
        const guessHelp2 = `\n__**${prefix}guess**__\nGuess a random number between the range you set.\nFor example:\n\`${prefix}guess ${Math.floor((Math.random() * 100) + 10)}\``;
        const todoLHelp = `\n__**${prefix}todo list**__\nThe bot will send you your todo list.`;
        const todoAHelp = `\n__**${prefix}todo add**__\nAdd an item to your todo list.\nFor example:\n\`${prefix}todo add test\``;
        const todoRHelp = `\n__**${prefix}todo remove**__\nRemove an item from your todo list.\nFor example:\n\`${prefix}todo remove test\` (You can also use numbers.)`;
        const todoChHelp = `\n__**${prefix}todo check**__\nChecks an item in your todo list.\nFor example:\n\`${prefix}todo check test\` (Also works with numbers)`;
        const todoCHelp = `\n__**${prefix}todo clear**__\nClears your todo list.`;
        const todoPHelp = `\n__**${prefix}todo private**__\nMakes your todo list private.`;
        const calculateHelp = `\n__**${prefix}calculate**__\nCalculator.\nFor example:\n\`${prefix}calculate 1 + 2\`\n\`bot: 3\``;
        const dogHelp = `\n__**${prefix}dog**__\nSends a random image of a dog.\n`
        if(helpMsg.toLowerCase() == `ping`) {
            message.reply(pingHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `dog`) {
            message.reply(dogHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `calculate`) {
            message.reply(calculateHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `todo private`) {
            message.reply(todoPHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `todo clear`) {
            message.reply(todoCHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `todo check`) {
            message.reply(todoChHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `todo remove`) {
            message.reply(todoRHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `todo add`) {
            message.reply(todoAHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `todo list`) {
            message.reply(todoLHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `guess`) {
            message.reply(guessHelp2);
            return;
        }
        if(helpMsg.toLowerCase() == `guessset`) {
            message.reply(guesssetHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `serverinfo`) {
            message.reply(serverinfoHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `userinfo`) {
            message.reply(userinfoHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `flip a coin`) {
            message.reply(flipACoinHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `roll`) {
            message.reply(rollHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `pot`) {
            message.reply(potHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `reportbug`) {
            message.reply(bugReportHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `suggest`) {
            message.reply(suggestHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `say`) {
            message.reply(sayHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `info`) {
            message.reply(infoHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `todo`) {
            message.reply(todoHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `quote`) {
            message.reply(quoteHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `guess`) {
            message.reply(guessHelp);
            return;
        }
        if(helpMsg) {
            message.reply(`:x: This is not a command, type \`${prefix}help\` for a list of commands.`);
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