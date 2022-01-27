// install express with `npm install express`
const express = require("express")
const app = express()
const PORT = 3000

const { Deta } = require("deta")
const deta = Deta()

const user = require("./routes/users")(deta)

app.use(express.json())

app.use("/api/v1/user", user)

app.get("/", (req, res) => {
  res.json({ msg: "Deta blisshub User" })
})

// export 'app'
module.exports = app

/* // local testing
app.listen(PORT, () => {
  console.log(`listen at : ${PORT}`)
}) */
