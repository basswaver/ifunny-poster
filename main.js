const config = require('./config.json')
const disk = require('./disk')
const { robot, post_random_image } = require('./poster')

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason.stack);
    // application specific logging, throwing an error, or other logic here
})

robot.on('login', async () => {
    console.log(await robot.nick, "may post anime girls");
    post_random_image()
    robot.start_posting(10)

})

robot.on('notification', async (note) => {
    if (await note.type === 'smile') {
        disk.add_smile((await note.post)
            .id)
    }

    if (await note.type === 'repub') {
        disk.add_repub((await note.post)
            .id)
    }

    if (await note.type === 'comment') {
        let comment = await note.comment

        if ((await comment.text)
            .toLowerCase()
            .match(/(sauce)|(source)/g)) {

            let author = await comment.author
            data = await disk.get_data((await note.post)
                .id)

            try {
                await comment.reply(`Post ID on SafeBooru is ${data.safebooru_id}`)
            } catch (err) {}
        }
    }
})

robot.login(config.email, config.password)

module.exports = { robot }
