const { newUser, getData } = require("./db.js")
const { generateNewTokenPair, generateTempAccessToken, checkToken, generateNewTokenPairFromRefreshToken } = require("./jwt.js")

const bcrypt = require('bcrypt');
const express = require("express");

console.log("Running the dev server.")

const PORT = process.env.PORT || 3001;

const app = express();
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());


app.post("/temp", async (req, res) => {
  const token = await generateTempAccessToken(req.body.ime)
  if (token) {
    res.json({ token: token, expiresIn: "1 hour", error: false });
  } else {
    res.json({ error: true });
  }
});

app.post("/zgeslom", async (req, res) => {
  if (req.body.register) {
    bcrypt.hash(req.body.geslo, 10, async function (err, hash) {
      const success = await newUser(req.body.ime, hash)

      if (success) {
        //uspešno
        const [token, refreshToken] = generateNewTokenPair(req.body.ime)
        res.cookie('refershToken', refreshToken, { maxAge: 900000, httpOnly: true, path: '/exchangeToken' });
        res.json({ token: token, refreshToken: refreshToken, error: false });
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
        res.cookie('refreshToken', refreshToken, { maxAge: 900000, httpOnly: true, path: '/exchangeToken' });
        res.json({ token: token, refreshToken: refreshToken, error: false });
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
    res.json({error:true, errorMsg:"No refresh token."})
    return;
  }
  const data = await generateNewTokenPairFromRefreshToken(refreshToken)
  if (!data) {
    console.log("Error with the token")
    res.json({error: true, errorMsg:"Invalid refresh token."})
    return;
  }
  const [newToken, newRefreshToken] = data;
  
  res.cookie('refreshToken', newRefreshToken, { maxAge: 900000, httpOnly: true, path: '/exchangeToken' });
  res.json({ token: newToken, refreshToken: newRefreshToken, error: false });
});

app.post("/message", async (req, res) => {
  console.log("Got messgae")
  console.log(req.cookies['refreshToken']);
  const token = req.body.token
  const tokenData = await checkToken(token)

  //console.log(tokenData)
  res.json({})
});

app.get("/api", (req, res) => {
  res.json({ message: "Začasna prijava uspela: token" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});