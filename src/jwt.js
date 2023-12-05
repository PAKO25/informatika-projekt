const jwt = require("jsonwebtoken")
const { tempNameToDb, newTokenFamily, checkTokenFamily, updateTokenFamily } = require("./db.js")

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
    const refreshToken = jwt.sign(refreshPayload, process.env.SECRET, { expiresIn: "30d" });

    return [token, refreshToken]
}
async function generateTempAccessToken(name) {
    const count = await tempNameToDb(name)
    const username = name + " " + count.toString()
    const payload = {
        username: username,
        verified: false
    }
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
    return [token, username];
}

function checkToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) resolve(undefined)

            resolve(user);
        })
    })
}

function generateNewTokenPairFromRefreshToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET, async (err, user) => {
            if (err) return resolve(undefined)

            const validFamily = await checkTokenFamily(user.family, user.generation)
            if (!validFamily) {
                console.log("Invalid token family, either violations have occured or it has been disbled.")
                updateTokenFamily(user.family, user.generation, true)
                return resolve(undefined)
            }

            updateTokenFamily(user.family, user.generation + 1, false)

            //access token
            const payload = {
                username: user.username,
                verified: true,
                family: user.family,
                generation: user.generation + 1,
                refresh: false
            }
            const newToken = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

            //refresh token
            const refreshPayload = {
                username: user.username,
                family: user.family,
                generation: user.generation + 1,
                refresh: true
            }
            const newRefreshToken = jwt.sign(refreshPayload, process.env.SECRET, { expiresIn: "30d" });

            resolve([newToken, newRefreshToken, user.username])
        })
    })
}

module.exports = { generateNewTokenPair, generateTempAccessToken, checkToken, generateNewTokenPairFromRefreshToken }