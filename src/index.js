const prod = process.env.PROD || false;

if (prod) {
  require("./server.js")
} else {
  require("./dev-server.js")
}

require("./db.js")