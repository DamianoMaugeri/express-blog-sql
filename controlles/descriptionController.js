const posts = require('../data/posts.js')

const index = (req, res) => {
    let description = posts.map(post => post.tags).flat().filter((tag, i, arr) => arr.indexOf(tag) === i)
    res.json(description)
}

module.exports = { index }