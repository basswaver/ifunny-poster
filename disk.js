const fs = require('fs')

const file = './data.json'
var data

const populated = {}

async function unique_join(arrays) {
    let pile = []
    for (let sub of arrays) {
        pile = [...pile, ...sub]
    }

    return [...(new Set(pile))]
}

function load_data() {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, {})
    }

    try {
        data = JSON.parse(fs.readFileSync(file))

    } catch (err) {
        if (err instanceof SyntaxError) {
            data = JSON.parse('{}')
            return
        }

        throw err
    }
}

function populate() {
    for (let key of Object.keys(populated)) {
        if (!data[key]) {
            data[key] = {}
        }
    }

    write_data()
}

function write_data() {
    fs.writeFileSync(file, JSON.stringify(data))
}

async function create_post(post_id, tags, safebooru_id) {
    data[post_id] = {
        tags: tags,
        smile_count: 0,
        repub_count: 0,
        safebooru_id: safebooru_id
    }
    write_data()
}

async function add_smile(post_id) {
    data[post_id].smile_count += 1
    write_data()
}

async function add_repub(post_id) {
    data[post_id].repub_count += 1
    write_data()
}

async function get_data(post_id) {
    return data[post_id]
}

load_data()
populate()

module.exports = {
    get_data,
    create_post,
    add_smile,
    add_repub
}
