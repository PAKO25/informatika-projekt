console.log("Loading the database.")

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const { v4: uuidv4 } = require('uuid');

db.serialize(() => {

    //db.run("DROP TABLE tokenfamilies")
    //db.run("CREATE TABLE uporabniki (id TEXT, username TEXT, password TEXT)")
    //db.run("INSERT INTO uporabniki VALUES ('randomid', 'randomusername', 'randompassword')")
    //db.run("DELETE FROM uporabniki WHERE id='randomid'")

    /*db.all("SELECT * FROM tempnames", (err, row) => {
        console.log(row)
    })*/

    //db.run("CREATE TABLE tempnames (name TEXT, count NUMBER)")
    //db.run("CREATE TABLE tokenfamilies (id TEXT, generation NUMBER, disabled BOOLEAN, createdAt NUMBER)")
});

function newUser(ime, hash) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM uporabniki WHERE username="${ime}"`, (err, row) => {
            if (row == undefined) {
                db.run(`INSERT INTO uporabniki VALUES ("randomid123", "${ime}", "${hash}")`);
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
//export ^^

module.exports = { newUser, getData, tempNameToDb, newTokenFamily }