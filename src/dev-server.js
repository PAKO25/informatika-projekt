const { newUser, getData } = require("./db.js")

const bcrypt = require('bcrypt');
const express = require("express");

console.log("Running the dev server.")

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());


app.post("/temp", (req, res) => {
  console.log(req.body)
  res.json({ message: "Začasna prijava uspela: token" });
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
        res.json({ error: "Uporabnik že obstaja." })
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
        res.json({ error: "Napačno ime ali geslo." })
      }
    });
  }
})

app.get("/api", (req, res) => {
  res.json({ message: "Začasna prijava uspela: token" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});