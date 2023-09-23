require('dotenv').config();

const prod = process.env.PROD || false;

if (prod) {
  require("./server.js")
} else {
  require("./dev-server.js")
}