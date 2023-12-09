const { newUser, getData } = require("./db.js")
const { generateNewTokenPair, generateTempAccessToken, checkToken, generateNewTokenPairFromRefreshToken } = require("./jwt.js")

const bcrypt = require('bcrypt');
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");

console.log("Running the dev server.")

const PORT = process.env.PORT || 3001;

const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors')
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

app.post("/temp", async (req, res) => {
  const [token, username] = await generateTempAccessToken(req.body.ime)
  if (token) {
    res.json({ token: token, expiresIn: "1 hour", error: false, username: username });
  } else {
    res.json({ error: true, errorMsg: 'An error occured, check console.' });
  }
});

app.post("/zgeslom", async (req, res) => {
  if (req.body.register) {
    bcrypt.hash(req.body.geslo, 10, async function (err, hash) {
      const success = await newUser(req.body.ime, hash)

      if (success) {
        //uspešno
        const [token, refreshToken] = generateNewTokenPair(req.body.ime)
        res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: '/exchangeToken', sameSite: 'Strict' });
        res.json({ token: token, error: false });
      } else {
        res.json({ error: true, errorMsg: "Uporabnik že obstaja." })
      }
    });
  } else {
    const hash = await getData(req.body.ime);

    bcrypt.compare(req.body.geslo, hash, function (err, result) {
      console.log(result ? "Pravilno geslo" : "Napačno geslo")
      if (result) {
        //pravo geslo
        const [token, refreshToken] = generateNewTokenPair(req.body.ime)
        res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: '/exchangeToken', sameSite: 'Strict' });
        res.json({ token: token, error: false });
      } else {
        //napačno geslo
        res.json({ error: true, errorMsg: "Napačno geslo." })
      }
    });
  }
})

app.post("/exchangeToken", async (req, res) => {
  const refreshToken = req.cookies['refreshToken']
  if (!refreshToken) {
    res.json({ error: true, errorMsg: "No refresh token." })
    return;
  }
  const data = await generateNewTokenPairFromRefreshToken(refreshToken)
  if (!data) {
    console.log("Error with the token")
    res.json({ error: true, errorMsg: "Invalid refresh token." })
    return;
  }
  const [newToken, newRefreshToken, username] = data;

  res.cookie('refreshToken', newRefreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, path: '/exchangeToken', sameSite: 'Strict' });
  res.json({ token: newToken, error: false, username: username });
});

httpServer.listen(PORT);

module.exports = { io }