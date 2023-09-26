const { newUser, getData } = require("./db.js")
const { generateNewTokenPair, generateTempAccessToken, checkToken } = require("./jwt.js")

const bcrypt = require('bcrypt');
const express = require("express");

console.log("Running the dev server.")

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());


app.post("/temp", async (req, res) => {
  const token = await generateTempAccessToken(req.body.ime)
  if (token) {
    res.json({ token: token, expiresIn: "1 hour", error: false });
  } else {
    res.json({ error: true });
  }
});

app.post("/zgeslom", async (req, res) => {
  console.log(req.body) //req.body.geslo
  if (req.body.register) {
    bcrypt.hash(req.body.geslo, 10, async function (err, hash) {
      const success = await newUser(req.body.ime, hash)

      if (success) {
        //uspešno
        res.json({ token: "Registracija uspela: token" });
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
        res.json({ token: "Registracija uspela: token" });
      } else {
        //napačno geslo
        res.json({ error: true, errorMsg: "Napačno geslo." })
      }
    });
  }
})

app.post("/message", async (req, res) => {
  console.log("Got messgae")
  const token = req.body.token
  const tokenData = await checkToken(token)

  console.log(tokenData)
  res.json({})
});

app.get("/api", (req, res) => {
  res.json({ message: "Začasna prijava uspela: token" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});