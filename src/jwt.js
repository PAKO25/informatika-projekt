const jwt = require("jsonwebtoken")
const { tempNameToDb } = require("./db.js")

function generateNewTokenPair() {

}
async function generateTempAccessToken(name) {
    const count = await tempNameToDb(name)
    const payload = {
        username: name + " " + count.toString(),
        verified: false
    }
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
    return token;
}

function checkToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) console.log(err)

            resolve(user);
        })
    })
}

module.exports = { generateNewTokenPair, generateTempAccessToken, checkToken }