console.log("Loading the database.")

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {

    //db.run("DROP TABLE uporabniki")
    //db.run("CREATE TABLE uporabniki (id TEXT, username TEXT, password TEXT)")
    //db.run("INSERT INTO uporabniki VALUES ('randomid', 'randomusername', 'randompassword')")
    //db.run("DELETE FROM uporabniki WHERE id='randomid'")

    db.all("SELECT * FROM uporabniki", (err, row) => {
        console.log(row)
    })

});

function newUser(ime, hash) {
    console.log("Creating new user")
    db.serialize(() => {
        db.run(`INSERT INTO uporabniki VALUES ("randomid123", "${ime}", "${hash}")`);
    });
}
async function getData(ime) {
    //get hash from db
    return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM uporabniki WHERE username="${ime}"`, (err, row) => {
        resolve(row.password)
    })
})
}
//export ^^

module.exports = { newUser, getData }