async function editedCmd(message) {
    let editedMsg = await message.channel.send('i');
    await editedMsg.edit('‫my message ‫i');
}

module.exports.editedCmd = editedCmd;