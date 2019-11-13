const axios = require('axios');
const { robot } = require('./robot')
const disk = require('./disk')
const { Safe } = require('./booru');


const random_of = (iter) => { return iter[Math.floor(Math.random() * iter.length)] }

const tag_sets = [
    ['breasts', 'solo', '1girl'], // 331840
    ['cleavage', 'solo'], // 145240
    ['ass', 'solo', '1girl'], // 38160
    ['breasts', 'solo', '1girl', '-rating:safe'], // 3240
    ['cleavage', '-rating:safe', 'solo'], // 2360
    ['ass', '-rating:safe'], // 1600
    ['ass', 'solo', '1girl', 'pokemon'], // 440
    ['cleavage', '-rating:safe', '2girls'] // 280
]

const post_tags = [
    'booru', 'anime', 'girl',
    'cute', 'pantsu', 'danbooru', 'robot', 'robutt'
]

async function post_random_image() {
    if ((await robot.bans)
        .length) {
        return
    }

    let tags = random_of(tag_sets)
    let image = await Safe.random(tags, { cap: 1000 * 40 })

    if (!image) {
        return
    }

    let response = await axios({
        url: `https://safebooru.org/images/${image.directory}/${image.image}`,
        method: 'GET',
        responseType: 'stream'
    })

    if (!response.data) {
        return
    }

    let post = await robot.post_image(response.data, { wait: true, tags: post_tags })
    await disk.create_post(post.id, image.tags.split(" "), image.id)

}

robot.start_posting = (minutes) => {
    setInterval(post_random_image, 1000 * 60 * (minutes || 1))
}


module.exports = { robot, post_random_image }
