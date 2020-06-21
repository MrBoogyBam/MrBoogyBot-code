const Discord = require('discord.js');
const config = require("./config.json");
const prefix = config.prefix;
const lmaoObamidSuck = config.lmaoObamidSuck;
const bot = new Discord.Client();
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
// const fs = require('fs');
// const ytdl = require('ytdl-core');
const myID = '368115473310547969';
const botID = '705103167557337258';
const check = ':white_check_mark:';

// bot ready message
bot.on('ready', async () => {
    console.log(`${bot.user.username} is now online!\nLogs vvvv`);
    bot.user.setActivity('MrBog', { type: "WATCHING" }).catch(console.error);
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
    keyv.delete('restart-server');
});

keyv.on('error', err => console.error('Keyv connection error:', err));

// toggle spam command
bot.on('message', async (message) => {
    if(message.content.toLowerCase() == `${prefix}togglespam`) {
        if(message.author.id !== `${myID}`) {
            message.reply('Sorry, only the creator of the bot can use this command.');
            return;
        }
        let toggleSpam = await keyv.get('toggle-spam'+message.channel.id);
        if(toggleSpam == undefined) {
            toggleSpam = false;
        }
        if(toggleSpam == true) {
            toggleSpam = false;
            await keyv.set('toggle-spam'+message.channel.id, toggleSpam);
            message.channel.send(`${check} Spam toggled off.`);
            return;
        } else {
            toggleSpam = true;
            await keyv.set('toggle-spam'+message.channel.id, toggleSpam);
            message.channel.send(`${check} Spam toggled on.`);
            return;
        }
    }
    let toggleSpam = await keyv.get('toggle-spam'+message.channel.id);
    if(toggleSpam == true) {
        if(message.content) {
            if(message.content == 'Spam toggled on.') return;
            if(message.content == 'Spam toggled off.') return;
            if(message.content.includes('Invalid command. Type')) {
                if(message.author.id == `${botID}`) return;
            }
            message.channel.send(message.content);
            return;
        }
    }
});

bot.on('message', async (message) => {
    if(message.author.bot) return;
    const args = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLowerCase();
    // test command
    if(message.content.toLowerCase() == `${prefix}test`) {
        message.reply(`${check} It works!`);
        return;
    }
    // pings command
    if(command === 'ping') {
        if(message.content.toLowerCase() == `${prefix}ping`) {
            const msg = await message.channel.send('🏓Pinging...');
            msg.edit(`🏓Pong!\nLatency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`);
            return;
        }
    }
    if(command === 'pimg') {
        if(message.content.toLowerCase() == `${prefix}pimg`) {
            const msgpimg = await message.channel.send('🏓Pimgimg...');
            msgpimg.edit(`🏓Pomg!\nLatemcy is ${Math.floor(msgpimg.createdTimestamp - message.createdTimestamp)}ms`);
            return;
        }
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
            message.reply(':x: you typed a bad thing and you should feel bad');
            return;
        }
        let todoPrivate = await keyv.get('todo-private'+todoUser.id);
        if(todoUser == undefined) {
            message.reply(':x: you typed a bad thing and you should feel bad');
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
            message.reply(':x: you typed a bad thing and you should feel bad');
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
            message.reply(':x: you typed a bad thing and you should feel bad');
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
            message.reply(':x: you typed a bad thing and you should feel bad');
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
            message.reply(':x: you typed a bad thing and you should feel bad');
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
    // join command (voice channel)
    if(message.content.toLowerCase() == `${prefix}join`) {
        if(!message.guild) {
            message.channel.send(':x: This command only works in a server.');
        }
        if(message.member.voice.channel) {
            await message.member.voice.channel.join();
            return;
        } else {
            message.reply(':x: You have to be in a voice channel.');
            return;
        }
    }
    // disconnect command (voice chat)
    if(message.author.bot) return;
    if(message.content.toLowerCase() == `${prefix}disconnect`) {
        if(!message.guild) {
            message.channel.send(':x: This command only works in a server.');
            return;
        }
        if(message.member.voice.channel) {
            await message.member.voice.channel.leave();
            return;
        } else {
            message.reply(':x: You have to be in a voice channel.');
            return;
        }
    }
    if(message.content.toLowerCase() == `${prefix}prefix` || `<@!${botID}> prefix`) {
        message.reply(`The prefix is \`${prefix}\``);
        return;
    }
    // quote request command
    if(message.content.toLowerCase().startsWith(`${prefix}quote request`)) {
        let quoteMsg = message.content.substring(17);
        bot.users.resolve(myID).send(`Quote request from ${message.author.username}: ${quoteMsg}`, { split: true });
        message.reply(`${check} I've sent the request to the creator of the bot.`);
        return;
    }
    // quote command
    if(message.content.toLowerCase() == `${prefix}quote`) {
        let quoteList = await keyv.get('quote-list');
        let quoteRandom = Math.floor(Math.random() * quoteList.length);
        message.channel.send(`${quoteList[quoteRandom]}`);
        return;
    }
    // quote add command
    if(message.content.toLowerCase().startsWith(`${prefix}quote add`)) {
        if(message.author.id !== myID) {
            message.reply(':x: Sorry, only the creator of the bot can use this command.');
            return;
        }
        if(message.content.toLowerCase() == `${prefix}quote add`) {
            message.reply(':x: you typed a bad thing and you should feel bad');
            return;
        }
        let quoteList = await keyv.get('quote-list');
        let quoteMsg = message.content.substring(13);
        if(quoteList == undefined) {
            quoteList = [];
        }
        quoteList.push(quoteMsg);
        await keyv.set('quote-list', quoteList);
        message.reply(`${check} Done.`);
        return;
    }
    // quote remove command
    if(message.content.toLowerCase().startsWith(`${prefix}quote remove`)) {
        if(message.author.id !== myID) {
            message.reply(':x:Sorry, only the creator of the bot can use this command.');
            return;
        }
        let quoteList = await keyv.get('quote-list');
        let quoteMsg = message.content.substring(16);
        let indexToRemove = quoteList.indexOf( quoteMsg );
        if(quoteList.length == 0) {
            message.reply(':x: There are no quotes to remove.');
            return;
        }
        if(indexToRemove == -1) {
            indexToRemove = parseInt(quoteMsg, 10) -1;
        }
        if(indexToRemove < 0 || indexToRemove >= quoteList.length || isNaN(indexToRemove)) {
            message.reply(':x: you typed a bad thing and you should feel bad');
            return;
        }
        quoteList.splice(indexToRemove, 1);
        await keyv.set('quote-list', quoteList);
        message.reply(`${check} Done.`);
        return;
    }
    // say command
    if(command === 'say') {
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
        return;
    }
    // says same everytime a message is sent
    if(message.content.toLowerCase() == `${prefix}togglesame`) {
        let toggleSame = await keyv.get('toggle-same'+message.channel.id);
        if(toggleSame == undefined) {
            toggleSame = false;
        }
        if(toggleSame == false) {
            toggleSame = true;
            await keyv.set('toggle-same'+message.channel.id, toggleSame);
            message.reply(`${check} Done.`);
        } else {
            toggleSame = false;
            await keyv.set('toggle-same'+message.channel.id, toggleSame);
            message.reply(`${check} Done.`);
            return;
        }
    }
    let toggleSame = await keyv.get('toggle-same'+message.channel.id);
    if(toggleSame == true) {
        if(message.content) {
            message.channel.send('same');
        }
    }
    // says bruh everytime someone sends a message
    if(message.content.toLowerCase() == `${prefix}togglebruh`) {
        let toggleBruh = await keyv.get('toggle-bruh'+message.channel.id);
        if(toggleBruh == undefined) {
            toggleBruh = false;
        }
        if(toggleBruh == false) {
            toggleBruh = true;
            await keyv.set('toggle-bruh'+message.channel.id, toggleBruh);
            message.channel.send(`${check} Bruh toggled on.`);
            return;
        } else {
            toggleBruh = false;
            await keyv.set('toggle-bruh'+message.channel.id, toggleBruh);
            message.channel.send(`${check} Bruh toggled off.`);
            return;
        }
    }
    let toggleBruh = await keyv.get('toggle-bruh'+message.channel.id);
    if(toggleBruh == true) {
        if(message.content) {
            message.channel.send('Bruh');
        }
    }
    if(message.content.toLowerCase() == `${prefix}ttest`) { 
        for(let item of ["1", "2", "3"]) {
            console.log(item);
        }
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
            message.reply(':x: you typed a bad thing and you should feel bad');
            return;
        }
        if(guessNums[0] > guessNums[1]) {
            message.reply(':x: you typed something bad and you should feel bad');
            return;
        }
        if(guessNums.length >= 3) {
            message.reply(':x: you typed a bad thing and you should feel bad');
            return;
        }
        if(isNaN(guessNums[0]) || isNaN(guessNums[1])) {
            message.reply(':x: you typed something bad and you should feel bad');
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
            message.reply(':x: you typed a bad thing and you should feel bad');
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
            message.reply(':x: you typed a bad thing and you should feel bad');
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
            message.reply(':x: You have to pick heads or tails.');
            return;
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
    // suggest command
    if(command === 'suggest') {
        if(message.content.toLowerCase().startsWith(`${prefix}suggest`)) {
            if(message.content == `${prefix}suggest`) {
                message.reply('Must put suggestion in suggestion.');
                return;
            }
            const suggestMsg = message.content.substring(10);
            //eslint-disable-next-line no-unused-vars
            message.delete().catch(O_o=>{});
            bot.users.resolve(`${myID}`).send(`Suggestion from ${message.author}: ${suggestMsg}`);
            message.reply('Your suggestion has been sent.');
            return;
        }
    }
    // toggles mans
    if(message.content.toLowerCase() == `${prefix}togglemans`) {
        let lmfaomans = await keyv.get('toggle-mans'+message.channel.id);
        if(lmfaomans == undefined) {
            lmfaomans = false;
        }
        if(lmfaomans == true) {
            lmfaomans = false;
            message.channel.send(`${check} Mans toggled off.`);
            await keyv.set('toggle-mans'+message.channel.id, lmfaomans);
            return;
        }
        lmfaomans = true;
        message.channel.send(`${check} Mans toggled on.`);
        await keyv.set('toggle-mans'+message.channel.id, lmfaomans);
        return;
    }
    let lmfaomans = await keyv.get('toggle-mans'+message.channel.id);
    if(lmfaomans == true) {
        if(message.content.toLowerCase().includes('lmao')) {
            message.channel.send('Lmao Man chinese hacker?');
        }
    }
    if(lmfaomans == true) {
        if(message.content.toLowerCase().includes('lmfao')) {
            message.channel.send('Lmfao Man chinese hacker?');
        }
    }
    if(lmfaomans == true) {
        if(message.content.toLowerCase().includes('lmbao')) {
            message.channel.send('Lmbao Man chinese hacker?');
        }
    }
    // bug report command
    if(message.content.toLowerCase().startsWith(`${prefix}bug report`)) {
        if(message.content.toLowerCase() == `${prefix}bug report`) {
            message.reply(':x: you typed something bad and you should feel bad');
            return;
        }
        const bugMsg = message.content.substring(14);
        //eslint-disable-next-line no-unused-vars
        message.delete().catch(O_o=>{});
        bot.users.resolve(myID).send(`Bug report from ${message.author.username}: ${bugMsg}`);
        message.reply(`${check} Your bug report has been sent.`);
        return;
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
            const bugReportCmd = `**${prefix}bug report**\n`;
            const quoteCmds = `**${prefix}quote**\n`;
            const toggleCmds = `**${prefix}toggle**\n`;
            const potCmd = `**${prefix}pot**\n`;
            const rollCmd = `**${prefix}roll**\n`;
            const flipACoinCmd = `**${prefix}flip a coin**\n`;
            const todoCmds = `**${prefix}todo**\n`;
            const guessCmds = `**${prefix}guess**\n`;
            message.reply(`${commandsHelp}${botPrefix}${pingCmd}${infoCmds}${sayCmd}${suggestCmd}${bugReportCmd}${quoteCmds}${toggleCmds}${potCmd}${rollCmd}${flipACoinCmd}${todoCmds}${guessCmds}`)
            return;
        }
        let helpMsg = message.content.substring(8);
        const typeHelp = `\n__**Type \`${prefix}help command\` to see what the command does.**__\n`;
        const todoHelp = `${typeHelp}**__${prefix}todo commands__**\n\n**${prefix}todo list**\n**${prefix}todo add**\n**${prefix}todo remove**\n**${prefix}todo clear**\n**${prefix}todo private**\n**${prefix}todo check**`;
        const quoteHelp = `${typeHelp}**__${prefix}quote commands__**\n\n**${prefix}quote request**\n**${prefix}quote**`;
        const guessHelp = `${typeHelp}**__${prefix}guess commands__**\n\n**${prefix}guessset**\n**${prefix}guess**`;
        const toggleHelp = `${typeHelp}**__${prefix}toggle commands__**\n\n**${prefix}togglespam**\n**${prefix}togglebruh**\n**${prefix}togglesame**\n**${prefix}togglemans**`;
        const infoHelp = `${typeHelp}**__${prefix}info commands__**\n\n**${prefix}serverinfo**\n**${prefix}userinfo**`;
        const pingHelp = `\n__**${prefix}ping**__\nShows you the ping of the bot.`;
        const sayHelp = `\n**__${prefix}say__**\nThe bot will say what you told him to say.\nFor example:\n\`${prefix}say test\`\n\`bot: test\``;
        const suggestHelp = `\n__**${prefix}suggest**__\nThe bot will send the creator of the bot your suggestion.\nFor example:\n\`${prefix}suggest make a todo list command\``;
        const bugReportHelp = `\n__**${prefix}bug report**__\nThe bot will send the creator of the bot your bug report.\nFor example:\n\`${prefix}bug report mb!roll is not working.\``;
        const potHelp = `\n__**${prefix}pot**__\nShows you how to install potPNG mod.`;
        const rollHelp = `\n__**${prefix}roll**__\nRolls a number between a range you choose.\nFor example:\n\`${prefix}roll ${Math.floor((Math.random() * 10) + 1)}/${Math.floor((Math.random() * 100) + 10)}\``;
        const flipACoinHelp = `\n__**${prefix}flip a coin**__\nFlips a coin.\nFor example:\n\`${prefix}flip a coin heads\`\n\`bot: It's tails, you lose.\``;
        const userinfoHelp = `\n__**${prefix}userinfo**__\nShows information about your account, you can also use it on other people.\nFor example:\n\`${prefix}userinfo 368115473310547969\``;
        const serverinfoHelp = `\n__**${prefix}serverinfo**__\nShows information about the server.`;
        const quoteRHelp = `\n__**${prefix}quote request**__\nRequest a quote for \`${prefix}quote\`.\nFor example:\n\`${prefix}quote request "Mathematics is written for mathematicians." - Nicolaus Copernicus\``;
        const quoteHelp2 = `\n__**${prefix}quote**__\nSends a random quote.`;
        const guesssetHelp = `\n__**${prefix}guessset**__\nSet a range for \`${prefix}guess\`.\nFor example:\n\`${prefix}guessset ${Math.floor((Math.random() * 10) + 1)}/${Math.floor((Math.random() * 100) + 10)}\``;
        const guessHelp2 = `\n__**${prefix}guess**__\nGuess a random number between the range you set.\nFor example:\n\`${prefix}guess ${Math.floor((Math.random() * 100) + 10)}\``;
        const togglespamHelp = `\n__**${prefix}togglespam**__\nThe bot will spam the message you sent. (Only the creator of the bot can use this command.)`;
        const togglebruhHelp = `\n__**${prefix}togglebruh**__\nThe bot will say bruh after every message you send.`;
        const togglesameHelp = `\n__**${prefix}togglesame**__\nThe bot will say same after every message you send.`;
        const togglemansHelp = `\n__**${prefix}togglemans**__\nThe bot will ask about the mans hackers when you mention them.`;
        const todoLHelp = `\n__**${prefix}todo list**__\nThe bot will send you your todo list.`;
        const todoAHelp = `\n__**${prefix}todo add**__\nAdd an item to your todo list.\nFor example:\n\`${prefix}todo add test\``;
        const todoRHelp = `\n__**${prefix}todo remove**__\nRemove an item from your todo list.\nFor example:\n\`${prefix}todo remove test\` (You can also use numbers.)`;
        const todoChHelp = `\n__**${prefix}todo check**__\nChecks an item in your todo list.\nFor example:\n\`${prefix}todo check test\` (Also works with numbers)`;
        const todoCHelp = `\n__**${prefix}todo clear**__\nClears your todo list.`;
        const todoPHelp = `\n__**${prefix}todo private**__\nMakes your todo list private.`;
        if(helpMsg.toLowerCase() == `ping`) {
            message.reply(pingHelp);
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
        if(helpMsg.toLowerCase() == `togglemans`) {
            message.reply(togglemansHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `togglesame`) {
            message.reply(togglesameHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `togglebruh`) {
            message.reply(togglebruhHelp);
            return;
        }
        if(helpMsg.toLowerCase() == `togglespam`) {
            message.reply(togglespamHelp);
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
        if(helpMsg.toLowerCase() == `quote`) {
            message.reply(quoteHelp2);
            return;
        }
        if(helpMsg.toLowerCase() == `quote request`) {
            message.reply(quoteRHelp);
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
        if(helpMsg.toLowerCase() == `bug report`) {
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
        if(helpMsg.toLowerCase() == `toggle`) {
            message.reply(toggleHelp);
            return;
        }
        if(helpMsg) {
            message.reply(`:x: This is not a command, type \`${prefix}help\` for a list of commands.`);
            return;
        }
    }
    // if a command is invalid
    let toggleSpam = await keyv.get('toggle-spam'+message.channel.id);
    if(message.content.toLowerCase().startsWith(`${prefix}`)) {
        if(toggleSame == true) return;
        if(toggleSpam == true) return;
        if(message.content.toLowerCase() == `${prefix}togglespam`) return;
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