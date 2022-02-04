// install express with `npm install express`
const express = require("express")
const app = express()
const PORT = 3000
require("dotenv").config()

const { Deta } = require("deta")

const deta = Deta(process.env.DETA_PROJECT_KEY || "")

const userV1 = require("./routes/users")(deta)

const auth = require("./routes/auth")(deta)
const local = require("./routes/auth/local")(deta)

app.use(express.json())

// basic V1 routes
app.use("/auth/v1/user", userV1)

// extended auth routes
app.use("/auth/", auth)
app.use("/auth/local/", local)

// basic api info
app.get("/", (req, res) => {
  res.json({ msg: "Deta Microservices Users" })
})

/* // export 'app'
module.exports = app
 */

// local testing

app.listen(PORT, () => {
  console.log(`listen at : ${PORT}`)
})
