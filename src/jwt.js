const jwt = require("jsonwebtoken")
const { tempNameToDb, newTokenFamily } = require("./db.js")

function generateNewTokenPair(name) {

    const family = newTokenFamily();

    //access token
    const payload = {
        username: name,
        verified: true,
        family: family,
        generation: 1,
        refresh: false
    }
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

    //refresh token
    const refreshPayload = {
        username: name,
        family: family,
        generation: 1,
        refresh: true
    }
    const refreshToken = jwt.sign(refreshPayload, process.env.SECRET, { expiresIn: "14d" });

    return [token, refreshToken]
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
            if (err) resolve(undefined)

            resolve(user);
        })
    })
}

module.exports = { generateNewTokenPair, generateTempAccessToken, checkToken }