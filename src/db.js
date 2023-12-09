console.log("Loading the database.")

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const { v4: uuidv4 } = require('uuid');

db.serialize(() => {

    //db.run("DROP TABLE tokenfamilies")
    //db.run("CREATE TABLE uporabniki (id TEXT, username TEXT, password TEXT)")
    //db.run("INSERT INTO uporabniki VALUES ('randomid', 'randomusername', 'randompassword')")
    //db.run("DELETE FROM uporabniki WHERE id='randomid'")

    /*db.all("SELECT * FROM uporabniki", (err, row) => {
        console.log(row)
    })*/

    //db.run("CREATE TABLE tempnames (name TEXT, count NUMBER)")
    //db.run("CREATE TABLE tokenfamilies (id TEXT, generation NUMBER, disabled BOOLEAN, createdAt NUMBER)")
    //db.run(`CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, username TEXT, date NUMERIC);`)
    //db.run(`INSERT INTO messages (text, username, date) VALUES ('Hello, World!', 'test_username5', 1637683200000);`)
});

function newUser(ime, hash) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM uporabniki WHERE username="${ime}"`, (err, row) => {
            if (row == undefined) {
                db.run(`INSERT INTO uporabniki VALUES ("${uuidv4()}", "${ime}", "${hash}")`);
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}
async function getData(ime) {
    //get hash from db
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM uporabniki WHERE username="${ime}"`, (err, row) => {
            resolve(row ? row.password : "123")
        })
    })
}

function tempNameToDb(name) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM tempnames WHERE name="${name}"`, (err, row) => {
            if (row) {
                const count = row.count + 1;
                db.run(`UPDATE tempnames SET count=${count} WHERE name="${name}"`)
                resolve(count)
            } else {
                db.run(`INSERT INTO tempnames VALUES ("${name}", 1)`);
                resolve(1)
            }
        })
    })
}

function newTokenFamily() {
    const family = uuidv4()
    db.run(`INSERT INTO tokenfamilies VALUES ("${family}", 1, 0, ${Date.now()})`)
    return family;
}

function checkTokenFamily(familyId, generation) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM tokenfamilies WHERE id="${familyId}"`, (err, row) => {
            if (parseInt(row.generation) == generation && !row.disabled) {
                console.log("Success, the family is valid.")
                return resolve(true)
            }
            resolve(false)
        })
    })
}

function updateTokenFamily(familyId, newGeneration, disabled) {
    db.run(`UPDATE tokenfamilies SET generation = "${newGeneration}" WHERE id = "${familyId}"`)
    db.run(`UPDATE tokenfamilies SET disabled = ${disabled} WHERE id = "${familyId}"`)
}

function getMessages(range) {
    return new Promise((resolve, reject) => {
        const [lowerLimit, upperLimit] = range;
        db.all(`SELECT * FROM messages ORDER BY id DESC LIMIT ${upperLimit - lowerLimit + 1} OFFSET ${lowerLimit};`, (err, rows) => {
            err ? console.log(err) : null;
            return resolve(rows)
        })
    })
}

function addMessage(message) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO messages (text, username, date) VALUES ("${message.text}", "${message.username}", ${message.date});`)
        resolve()
    })
}

module.exports = { newUser, getData, tempNameToDb, newTokenFamily, checkTokenFamily, updateTokenFamily, addMessage, getMessages }