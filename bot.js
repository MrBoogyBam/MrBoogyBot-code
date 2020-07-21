const Discord = require('discord.js');
const config = require("./config.json");
const prefix = config.prefix;
const lmaoObamidSuck = config.lmaoObamidSuck;
const bot = new Discord.Client();
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
const fetch = require('node-fetch');
const myID = '368115473310547969';
const botID = '705103167557337258';
const check = ':white_check_mark:';
const currency = "BoogyBits";
let ABCType = false;

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
    if(timeInSeconds <2) {
        theChannel.send(`Done! Bot restarted in ${timeInSeconds} second and ${timeInMS}ms`);
        return;
    }
    theChannel.send(`Done! Bot restarted in ${timeInSeconds} seconds and ${timeInMS}ms`);
    await keyv.delete('restart-server');
});

keyv.on('error', err => console.error('Keyv connection error:', err));

// functions:
function badErr(message) {
    message.reply(':x: you typed a bad thing and you should feel bad');
}

async function lvlUp(message) {
    let experienceL = await keyv.get('user-experience'+message.author.id);
    let experienceG = await keyv.get('user-experience-goal'+message.author.id);
    let level = await keyv.get('user-level'+message.author.id);
    let currencyAmount = await keyv.get('currency-amount'+message.author.id);
    if(experienceL >= experienceG) {
        experienceG = experienceG * 2;
        if(experienceG >= 10000) {
            experienceG = 1000;
        }
        await keyv.set('user-experience-goal'+message.author.id, experienceG);
        experienceL = 0;
        await keyv.set('user-experience'+message.author.id, experienceL);
        level = level + 1;
        await keyv.set('user-level'+message.author.id, level);
        currencyAmount = currencyAmount + 100;
        await keyv.set('currency-amount'+message.author.id, currencyAmount);
        message.reply(`Congratulations! you are now level ${level}.`);
    }
}

async function msgExp(message) {
    if(new Date().getTime() < await keyv.get('msg-xp-cooldown'+message.author.id) + 180000) return;
    let experienceL = await keyv.get('user-experience'+message.author.id);
    experienceL = experienceL + 5;
    await keyv.set('user-experience'+message.author.id, experienceL);
    await lvlUp(message);
    let msgxpCooldown = new Date().getTime();
    await keyv.set('msg-xp-cooldown'+message.author.id, msgxpCooldown);
}

async function cmdsExp(message) {
    if(new Date().getTime() < await keyv.get('cmd-xp-cooldown'+message.author.id) + 180000) return;
    let experienceL = await keyv.get('user-experience'+message.author.id);
    experienceL = experienceL + 10;
    await keyv.set('user-experience'+message.author.id, experienceL);
    await lvlUp(message);
    let cmdxpCooldown = new Date().getTime();
    await keyv.set('cmd-xp-cooldown'+message.author.id, cmdxpCooldown);
}

async function gambleExp(message) {
    if(new Date().getTime() < await keyv.get('gamble-xp-cooldown'+message.author.id) + 360000) return;
    let experienceL = await keyv.get('user-experience'+message.author.id);
    experienceL = experienceL + 15;
    await keyv.set('user-experience'+message.author.id, experienceL);
    await lvlUp(message);
    let gamblexpCooldown = new Date().getTime();
    await keyv.set('gamble-xp-cooldown'+message.author.id, gamblexpCooldown);
}

async function guessExp(message) {
    if(new Date().getTime() < await keyv.get('guess-xp-cooldown'+message.author.id) + 480000) return;
    let experienceL = await keyv.get('user-experience'+message.author.id);
    let guessNums = await keyv.get('selected-numbers'+message.author.id+message.channel.id);
    experienceL = experienceL + Math.min(Math.round(Math.max(Math.log( guessNums[1] - guessNums[0] )*5, 0)),100);
    await keyv.set('user-experience'+message.author.id, experienceL);
    await lvlUp(message);
    let guessxpCooldown = new Date().getTime();
    await keyv.set('guess-xp-cooldown'+message.author.id, guessxpCooldown);
}

bot.on('message', async (message) => {
    if(message.author.bot) return;
    const args = message.content.substring(prefix.length).split(" ");
    // command xp
    if(message.content.toLowerCase().startsWith(`${prefix}`)) {
        await cmdsExp(message);
    }
    // test command
    if(message.content.toLowerCase() == `${prefix}test`) {
        message.reply(`${check} It works!`);
        return;
    }
    // pings command
    if(message.content.toLowerCase() == `${prefix}ping`) {
        const msg = await message.channel.send('🏓Pinging...');
        msg.edit(`🏓Pong!\nLatency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}pimg`) {
        const msgpimg = await message.channel.send('🏓Pimgimg...');
        msgpimg.edit(`🏓Pomg!\nLatemcy is ${Math.floor(msgpimg.createdTimestamp - message.createdTimestamp)}ms`);
        return;
    }
    // shows information about the server
    if(message.content.toLowerCase() == `${prefix}serverinfo`) {
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
    // shows information about the user
    if(message.content.toLowerCase().startsWith(`${prefix}userinfo`)) {
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
    if(message.content.toLowerCase() == `${prefix}level`) {
        let level = await keyv.get('user-level'+message.author.id);
        let experienceL = await keyv.get('user-experience'+message.author.id);
        let experienceG = await keyv.get('user-experience-goal'+message.author.id);
        if(level == undefined) {
            level = 0;
            await keyv.set('user-level'+message.author.id, level);
        }
        if(experienceL == undefined) {
            experienceL = 0;
            await keyv.set('user-experience'+message.author.id, experienceL);
        }
        if(experienceG == undefined) {
            experienceG = 100;
            await keyv.set('user-experience-goal'+message.author.id, experienceG);
        }
        const levelEmbed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username}'s level:`)
            .setAuthor(message.author.username, message.author.avatarURL())
            .setThumbnail(message.author.avatarURL())
            .setTimestamp()
            .setColor(message.member.displayHexColor)
            .setDescription(`**Level: ${level}**\n**XP: ${experienceL}/${experienceG}**`);
        message.reply(levelEmbed);
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
    if(message.content.toLowerCase().startsWith(`${prefix}todo change`)) {
        if(message.content.toLowerCase() == `${prefix}todo change`) {
            badErr(message);
            return;
        }
        let userTDChangeMsg = args.shift();
        console.log(userTDChangeMsg);
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
    // todo check command (unfinished)
    if(message.content.toLowerCase().startsWith(`${prefix}todo check`)) {
        let todoMsg = message.content.substring(14);
        let todoList = await keyv.get('todo-list'+message.author.id);
        let indexToCheck = todoList.indexOf( todoMsg );
        if(indexToCheck == -1) {
            indexToCheck = parseInt(todoMsg, 10) -1;
        }
        if(indexToCheck == isNaN(NaN)) {
            badErr(message);
            return;
        }
        todoList[indexToCheck] = "~~" + todoList[indexToCheck] + `~~ ${check}`;
        await keyv.set('todo-list'+message.author.id, todoList);
        message.reply(`${check} Done.`);
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
    // todo clear command
    if(message.content.toLowerCase() == `${prefix}todo clear`) {
        let todoList = keyv.get('todo-list'+message.author.id);
        if(todoList.length == 0) {
            message.reply(':x: Your todo list is already empty.');
            return;
        }
        keyv.delete('todo-list'+message.author.id);
        message.reply(`${check} Done.`);
        return;
    }
    // jobs suggestions
    if(message.content.toLowerCase().startsWith(`${prefix}jobrequest`)) {
        if(message.content.toLowerCase() == `${prefix}jobrequest`) {
            badErr(message);
            return;
        }
        let jobRequest = message.content.substring(14);
        // eslint-disable-next-line no-unused-vars
        message.delete().catch(O_o=>{});
        bot.users.resolve(myID).send(`Job request from ${message.author.username}: ${jobRequest}`);
        message.reply(`${check} Done.`);
        return;
    }
    // prefix command
    if(message.content.toLowerCase() == `${prefix}prefix` || message.content.toLowerCase() == `<@!${botID}> prefix`) {
        message.reply(`The prefix is \`${prefix}\``);
        return;
    }
    // jobs list command
    if(message.content.toLowerCase() == `${prefix}jobs`) {
        const jobsEmbed = new Discord.MessageEmbed()
            .setTitle('__**List of jobs:**__')
            .setDescription(`**Type \`${prefix}jobapply\` and the job you want.\nhr = 15m**`)
            .setTimestamp()
            .addFields(
                { name: "**Janitor:**", value: "Work as a Janitor\nBB6/hr" }
            )
            .setColor('2F3136');
        message.reply(jobsEmbed);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}jobapply`)) {
        if(message.content.toLowerCase() == `${prefix}jobapply`) {
            badErr(message);
            return;
        }
        let userJob = await keyv.get('user-job'+message.author.id);
        if(message.content.toLowerCase() == `${prefix}jobapply janitor`) {
            userJob = "Janitor";
            await keyv.set('user-job'+message.author.id, userJob);
            message.reply(`${check} You are now a ${userJob}`);
            return;
        }
    }
    /*let userJob = await keyv.get('user-job'+message.author.id);
    if(message.content.toLowerCase() == `${prefix}work`) {
        if(userJob == "Janitor") {

        }
    }*/
    // boogybits command
    if(message.content.toLowerCase() == `${prefix}boogybits`) {
        let currencyAmount = await keyv.get('currency-amount'+message.author.id);
        message.reply(`You have ${currencyAmount} ${currency}.`);
        return;
    }
    // gamble command
    if(message.content.toLowerCase().startsWith(`${prefix}gamble`)) {
        if(message.content.toLowerCase() == `${prefix}gamble`) {
            badErr(message);
            return;
        }
        const gambleRoll = Math.floor((Math.random() * 100) + 1);
        let currencyAmount = await keyv.get('currency-amount'+message.author.id);
        let gambleAmount = args[0];
        if(gambleAmount == "all") {
            gambleAmount = currencyAmount;
        }
        gambleAmount = parseInt(gambleAmount, 10);
        if(currencyAmount == undefined) {
            currencyAmount = 0;
        }
        if(gambleAmount > currencyAmount) {
            message.reply(`:x: You don't have enough ${currency}.`);
            return;
        }
        if(isNaN(gambleAmount)) {
            message.reply(':x: You can only use integers');
            return;
        }
        if(gambleAmount <= 0) {
            badErr(message);
            return;
        }
        currencyAmount = currencyAmount - gambleAmount;
        if(gambleRoll > 60) {
            if(gambleRoll == 69 || gambleRoll == 99 || gambleRoll == 100) {
                currencyAmount = currencyAmount + (gambleAmount * 3);
                await keyv.set('currency-amount'+message.author.id, currencyAmount);
                message.channel.send(`${message.author.username} rolled ${gambleRoll} and won ${gambleAmount * 3} <:PogChamp:726326803119079504> THREE TIMES THEIR BET <:PogChamp:726326803119079504> They now have ${currencyAmount} ${currency}.`);
                gambleExp(message);
                return;
            }
            currencyAmount = currencyAmount + (gambleAmount * 2);
            await keyv.set('currency-amount'+message.author.id, currencyAmount);
            message.channel.send(`${message.author.username} rolled ${gambleRoll} and won ${gambleAmount * 2} <:PogChamp:726326803119079504> They now have ${currencyAmount} ${currency}.`);
            return;
        } else if(gambleRoll <= 60) {
            await keyv.set('currency-amount'+message.author.id, currencyAmount);
            message.channel.send(`${message.author.username} rolled ${gambleRoll} and lost ${gambleAmount} <:LUL:726332433670340628> They now have ${currencyAmount} ${currency}.`);
            return;
        }
        return;
    }
    // setboogybits command (temp)
    if(message.content.toLowerCase().startsWith(`${prefix}setboogybits`)) {
        if(message.author.id !== '341076015663153153' && message.author.id !== '286600748094062602' && message.author.id !== myID) {
            message.reply(':x: you have no perms');
            return;
        } else {
            let currencyS = args[0];
            currencyS = parseInt(currencyS, 10);
            let currencyAmount = currencyS;
            await keyv.set('currency-amount'+message.author.id, currencyAmount);
            message.reply(`${check} Done.`);
            return;
        }
    }
    // calculate command
    if(message.content.toLowerCase().startsWith(`${prefix}calculate`)) {
        if(message.content.toLowerCase() == `${prefix}calculate`) {
            badErr(message);
            return;
        }
        let calculationNums = args;
        let number1 = calculationNums[0];
        let number2 = calculationNums[2];
        let operation = calculationNums[1];
        number1 = Number(number1, 10);
        number2 = Number(number2, 10);
        if(isNaN(number1 / number2) || isNaN(number1 + number2) || isNaN(number1 - number2) || isNaN(number1 * number2) || isNaN(number1 ** number2)) {
            message.reply(':x: Math error.');
            return;
        }
        if(isNaN(number1) || isNaN(number2)) {
            message.reply(':x: You can only use integers.');
            return;
        }
        if(operation == "+") {
            message.reply(number1 + number2);
            return;
        } else if (operation == "-") {
            message.reply(number1 - number2);
            return;
        } else if (operation == "*" || operation == "x") {
            message.reply(number1 * number2);
            return;
        } else if (operation == "/" || operation == ":" || operation == "÷") {
            message.reply(number1 / number2);
            return;
        } else if (operation == "^") {
            message.reply(number1 ** number2);
            return;
        } else {
            message.reply(':x: That is not an operation.');
            return;
        }
    }
    // say command
    if(message.content.toLowerCase().startsWith(`${prefix}say`) == true) {
        if(message.content.toLowerCase() == `${prefix}say`) {
            message.channel.send('_ _');
            return;
        }
        const sayMsg = message.content.substring(6);
        //eslint-disable-next-line no-unused-vars
        message.delete().catch(O_o=>{});
        message.channel.send(sayMsg);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}guessset`)) {
        if(message.content.toLowerCase() == `${prefix}guessset`) {
            message.reply(':x: You have to set a range.');
            return;
        }
        let guessNums = args.shift().split("/");
        guessNums[0] = +guessNums[0], 10;
        guessNums[1] = +guessNums[1], 10;
        let randomNum = Math.floor((Math.random() * (guessNums[1] - guessNums[0] + 1)) + guessNums[0]);
        if(guessNums[0] == Infinity || guessNums[1] == Infinity) {
            badErr(message);
            return;
        }
        if(guessNums[0] > guessNums[1]) {
            badErr(message);
            return;
        }
        if(guessNums.length >= 3) {
            badErr(message);
            return;
        }
        if(isNaN(guessNums[0]) || isNaN(guessNums[1])) {
            badErr(message);
            return;
        }
        await keyv.set('selected-numbers'+message.author.id+message.channel.id, guessNums);
        await keyv.set('random-number'+message.author.id+message.channel.id, randomNum);
        if(guessNums[0] <= -1000000 || guessNums[1] >= 1000000) {
            message.reply(`${check} glhf`);
            return;
        }
        message.reply(`${check} Done.`);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}guess`)) {
        if(message.content.toLowerCase() == `${prefix}guess`) {
            badErr(message);
            return;
        }
        let guessNums = await keyv.get('selected-numbers'+message.author.id+message.channel.id);
        let randomNum = await keyv.get('random-number'+message.author.id+message.channel.id);
        let userNum = message.content.substring(8);
        if(!guessNums) {
            message.reply(`You have to set the number first by using \`${prefix}guessset\``);
            return;
        }
        if(isNaN(userNum)) {
            badErr(message);
            return;
        }
        if(userNum < guessNums[0] || userNum > guessNums[1]) {
            message.reply(`Your number has to be between ${guessNums[0]}-${guessNums[1]}`);
            return;
        }
        if(userNum < randomNum) {
            message.channel.send(`The number is higher than ${userNum}`);
            return;
        }
        if(userNum > randomNum) {
            message.channel.send(`The number is lower than ${userNum}`);
            return;
        }
        if(userNum == randomNum) {
            message.channel.send(`The number was ${randomNum}, you got it!`);
            await guessExp(message);
            randomNum = Math.floor((Math.random() * (guessNums[1] - guessNums[0])) + guessNums[0]);
            await keyv.set('random-number'+message.author.id+message.channel.id, randomNum);
            return;
        }
        return;
    }
    // bot will agree with cumpet
    if(message.content.toLowerCase().startsWith("_")) {
        if(message.author.id !== '391725558062383105') return;
        message.channel.send('I agree with <@!391725558062383105>');
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}flip a coin`)) {
        if(message.content.toLowerCase() == `${prefix}flip a coin`) {
            let sides = [ "heads", "tails" ];
            let side = Math.floor(Math.random() * sides.length);
            if(side == 0) {
                message.reply(`The coin landed on heads.`);
                return;
            }
            if(side == 1) {
                message.reply(`The coin landed on tails.`);
                return;
            }
        }
        let coinUsrChoice = message.content.substring(15);
        let sides = [ "heads", "tails" ];
        let side = Math.floor(Math.random() * sides.length);
        if(coinUsrChoice == sides[0]) {
            if(side == 0) {
                message.reply(`It's heads, you win!`);
                return;
            }
            if(side == 1) {
                message.reply(`It's tails, you lose.`);
                return;
            }
        }
        if(coinUsrChoice == sides[1]) {
            if(side == 0) {
                message.reply(`It's heads, you lose.`);
                return;
            }
            if(side == 1) {
                message.reply(`It's tails, you win!`);
                return;
            }
        }
        if(coinUsrChoice !== sides[0] || coinUsrChoice !== sides[1]) {
            message.reply(':x: You can only pick heads or tails.');
            return;
        }
    }
    if(message.content.toLowerCase() == `${prefix}reaction test`) {
        const botMessage = await message.channel.send('vote i test vvv');
        botMessage.react('👍');
        botMessage.react('👎');
        return
    }
    // suggest command
    if(message.content.toLowerCase().startsWith(`${prefix}suggest`)) {
        if(message.content == `${prefix}suggest`) {
            message.reply(':x: Must put suggestion in suggestion.');
            return;
        }
        const suggestMsg = message.content.substring(10);
        //eslint-disable-next-line no-unused-vars
        message.delete().catch(O_o=>{});
        bot.users.resolve(`${myID}`).send(`Suggestion from ${message.author}: ${suggestMsg}`);
        message.reply('Your suggestion has been sent.');
        return;
    }
    // report bug command
    if(message.content.toLowerCase().startsWith(`${prefix}reportbug`)) {
        if(message.content.toLowerCase() == `${prefix}reportbug`) {
            badErr(message);
            return;
        }
        const bugMsg = message.content.substring(13);
        //eslint-disable-next-line no-unused-vars
        message.delete().catch(O_o=>{});
        bot.users.resolve(myID).send(`Bug report from ${message.author.username}: ${bugMsg}`);
        message.reply(`${check} Your bug report has been sent.`);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}abc`) {
        ABCType = true;
        message.reply('Type the English Alphabet.');
        let ABCTime = new Date().getTime();
        await keyv.set('abc-time'+message.channel.id, ABCTime);
        return;
    }
    if(ABCType == true) {
        if(message.content.toLowerCase() == `abcdefghijklmnopqrstuvwxyz`) {
            let timeInMSCalABC = (new Date().getTime() - await keyv.get('abc-time'+message.channel.id));
            let timeInSecondsABC = Math.floor(timeInMSCalABC / 1000);
            let timeInMSABC = timeInMSCalABC % 1000
            message.reply(`${message.author.username} typed the alphabet in ${timeInSecondsABC} seconds and ${timeInMSABC}ms.`);
            ABCType = false;
            return;
        }
    }
    // potPNG mod
    const modpackDownload = `\nModpack: http://www.anjo2.com/goi/modpack.zip`;
    const potDownloads = `__**PotPNG Mod**__\nModpack: http://www.anjo2.com/goi/modpack.zip\npotPNG: https://mega.nz/file/10MlUaDJ#eH0ECXpGFhIZblwSkTdw80FP2b-6E3iEdmiWndHDsxo\n\n`;
    const potHowToDownload = `__**How to install the potPNG mod**__\n1. Open steam.\n2. Go to library.\n3. Right click on Getting Over It.\n4. Click on properties.\n5. Go to Local Files.\n6. Click on "Browse Local Files"\n7. Open the PotPng.zip file.\n8. Drag the GettingOverIt_Data folder into the Getting Over It folder.\n9. Click on "Replace the files in the destination".\n10. Open the game.`;
    const modpackHowToDownload = `__**How to install the modpack**__\n1. Open steam.\n2. Go to library\n3. Right click on Getting Over It.\n4. Click on properties.\n5. Go to Local Files\n6. Click on "Browse Local Files".\n7. Drag all the files from the modpack.zip file to the Getting Over It folder.\n8. Open the game.`;
    const potInstructions = `__**How to make a custom pot**__\n1. Open steam.\n2. Go to library\n3. Right click on Getting Over It.\n4. Click on properties.\n5. Go to Local Files.\n6. Click on "Browse Local Files".\n7. Open the GettingOverIt_Data folder\n8. Open StreamingAssets folder.\n9. Open pots folder.\n10. Open PotLayout (With GIMP/Photoshop)\n11. Make a new pot.\n12. Export your pot.\n13. Rename the pot to "pot"\n14. Drag the potPNG you created into StreamingAssets folder.\n15. Open the game.`;
    if(message.content.toLowerCase() == `${prefix}pot`) {
        message.reply(`__**PotPNG mod**__\n\nPot commands:\n**${prefix}potdownload**\n**${prefix}modpackdownload**\n**${prefix}potdownload instructions**\n**${prefix}modpackdownload instructions**\n**${prefix}pot instructions**`);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}potdownload`) {
        message.reply(potDownloads);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}pot instructions`) {
        message.reply(potInstructions)
        return;
    }
    if(message.content.toLowerCase() == `${prefix}potdownload instructions`) {
        message.reply(potHowToDownload);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}modpackdownload`) {
        message.reply(modpackDownload);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}modpackdownload instructions`) {
        message.reply(modpackHowToDownload);
        return;
    }
    if(message.content.toLowerCase().startsWith(`${prefix}roll`)) {
        if(message.content.toLowerCase() == `${prefix}roll`) {
            message.reply(`:x: You have to set a range. For example: \`${prefix}roll ${Math.floor((Math.random() * 10) + 1)}/${Math.floor((Math.random() * 100) + 10)}\``);
        }
        let rollNums = args.shift().split("/");
        rollNums[0] = +rollNums[0], 10;
        rollNums[1] = +rollNums[1], 10;
        let randomRoll = Math.floor((Math.random() * (rollNums[1] - rollNums[0] + 1)) + rollNums[0]);
        message.reply(`Your number is ${randomRoll}`);
        return;
    }
    // dog command
    if(message.content.toLowerCase() == `${prefix}dog`) {
        const randomDogAPI = await (await fetch("https://random.dog/woof")).text();
        if(randomDogAPI.includes('mp4')) {
            message.channel.send(':x: Sorry, something went wrong, please try again.');
            return;
        }
        const randomDogL = `https://random.dog/${randomDogAPI}`;
        const randomDog = new Discord.MessageAttachment(randomDogL);
        message.channel.send(randomDog);
        return;
    }
    if(message.content.toLowerCase() == `${prefix}cat`) {
        const randomCatAPI = await (await fetch('https://api.thecatapi.com/v1/images/search')).json();
        console.log(randomCatAPI);
        return;
    }
    // random word test
    if(message.content.toLowerCase() == `${prefix}random word`) {
        const randomWord = await (await fetch("https://random-word-api.herokuapp.com/word?number=1&swear=0")).json();
        if(randomWord.includes('nigga' || 'nigger')) {
            message.channel.send(`:x: Something went wrong, please try again.`);
            return;
        }
        let RWTime = new Date().getTime();
        let RWChannelID = message.channel.id;
        await keyv.set('random-word-channel', RWChannelID);
        await keyv.set('random-word-time'+message.channel.id, RWTime);
        await keyv.set('random-word'+message.channel.id, (await message.channel.send(randomWord)).content);
        return;
    }
    if(message.content.toLowerCase() == await keyv.get('random-word'+message.channel.id)) {
        let timeInMSCalRW = (new Date().getTime() - await keyv.get('random-word-time'+message.channel.id));
        let timeInSecondsRW = Math.floor(timeInMSCalRW / 1000);
        let timeInMSRW = timeInMSCalRW % 1000;
        message.channel.send(`${message.author.username} typed the word in ${timeInSecondsRW} seconds and ${timeInMSRW}ms`);
        await keyv.delete('random-word'+message.channel.id);
        return;
    }
    // YEP COCK
    if(message.content == 'YEP') {
        message.channel.send('COCK');
        return;
    }
    // COCK YEP
    if(message.content == 'COCK') {
        message.channel.send('YEP');
        return;
    }
    // restart command
    if(message.content.toLowerCase() == `${prefix}restart`) {
        if(message.author.id !== `${myID}`) {
            message.reply(`Only the creator of the bot can use this command.`);
            return;
        }
        await keyv.set('restart-message', (await message.channel.send('Restarting... <a:loading:721573242686668861>')).id);
        await keyv.set('restart-time', new Date().getTime());
        await keyv.set('restart-server', message.guild.id);
        await keyv.set('restart-channel', message.channel.id);
        process.exit(0);
    }
    if(message.content) {
        await msgExp(message);
    }
    // secret command
    if(message.content.toLowerCase() == `${prefix}kgjfdnks`) {
        message.channel.send('Only people who saw this command know it exists its special');
        return;
    }
    // help command
    if(message.content.toLowerCase().startsWith(`${prefix}help`)) {
        if(message.content.toLowerCase() == `${prefix}help`) {
            const commandsHelp = `\n__**Type \`${prefix}help command\` to see what the command does.**__\n`;
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
    // if a command is invalid
    if(message.content.toLowerCase().startsWith(`${prefix}`)) {
        message.reply(`Invalid command. Type \`${prefix}help\` for a list of commands.`);
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