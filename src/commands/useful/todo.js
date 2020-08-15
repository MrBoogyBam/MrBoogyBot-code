const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('../../../config.json');
const prefix = config.prefix;
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
const functionsF = require('../../functions.js');
const badErr = functionsF.badErr;
const check = ':white_check_mark:';

async function todoListCmd(message) {
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

async function todoAddCmd(message) {
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

async function todoPrivateCmd(message) {
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

async function todoRemoveCmd(message) {
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

async function todoErr(message) {
    message.reply(`\`${prefix}todo\` is not a command, type \`${prefix}help todo\` for a list of todo commands.`);
    return;
}


module.exports.todoListCmd = todoListCmd;
module.exports.todoPrivateCmd = todoPrivateCmd;
module.exports.todoRemoveCmd = todoRemoveCmd;
module.exports.todoAddCmd = todoAddCmd;
module.exports.todoErr = todoErr;