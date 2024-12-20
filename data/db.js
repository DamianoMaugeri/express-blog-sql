const { ifError } = require('assert');
const mysql = require('mysql2')

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Kawasaki97',
        database: 'blog_db'

    }
);

connection.connect((err) => {
    console.log(`error: ${err}`)
    if (err) throw err
})


module.exports = connection