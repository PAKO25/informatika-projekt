//import { newUser, getData } from "./db";

const express = require("express");

console.log("Running the dev server.")

const PORT = process.env.PORT || 3001;

const app = express();


app.post("/temp", (req, res) => {
  res.json({ message: "Začasna prijava uspela: token" });
});
app.post("/zgeslom", (req, res) => {
  console.log(req)
  //newUser(req.read())
  res.json({ token: "Registracija uspela: token" });
})
app.get("/api", (req, res) => {
  res.json({ message: "Začasna prijava uspela: token" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});