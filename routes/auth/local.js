const express = require("express")
const passport = require("passport")
const { Strategy } = require("passport-local")
const bcrypt = require("bcrypt")
const { setSession, generateUniqueUUID } = require("../../utils/setSession")

/* 

Auth local is more simplify version of api/auth/* endpoints

It is require ./index.js to work properly.

local.js contain /login route use for login/create only use username/password
index.js contains /verify , /logout to simply verify / remove session

local created to be more organized and boilerplate for further Oauth / Email login strategy

*/

const route = (deta) => {
  const router = express.Router()
  const users = deta.Base("users")
  const session = deta.Base("session")

  //new LocalStrategy((username, password, done) => {})

  const LocalStrategy = new Strategy(async (username, password, done) => {
    const user = await users.fetch({ username })
    let res

    if (user.count === 1) {
      // check for password
      const verify = bcrypt.compareSync(password, user.items[0].password)
      if (verify) {
        // login
        const userId = user.items[0].key
        const sessionId = await setSession(session, userId)
        const config = {
          key: sessionId,
          userId: userId,
          created: Date.now(),
          expired: Date.now() + 1000 * 60 * 60 * 24 * 7,
        }
        await session.put(config)
        config.status = "LOGIN"
        res = config
      } else {
        // response with error
        res = { status: "LOGIN_FAILED", msg: "incorrect password" }
      }
    } else {
      // username does not exist create new user
      const hashed = bcrypt.hashSync(password, 8) // hashing password
      const key = await generateUniqueUUID(users) // user-id use referece in session
      const config = {
        key,
        username,
        password: hashed,
      }
      // create and login
      const putting = await users.put(config).then(async (user) => {
        // create success
        const userId = user.key
        const sessionId = await setSession(session, userId)

        const config = {
          key: sessionId,
          userId: userId,
          created: Date.now(),
          expired: Date.now() + 1000 * 60 * 60 * 24 * 7,
        }

        await session.put(config)
        config.status = "CREATE"
        res = config
      })
    }

    done(null, res)
  })

  passport.use(LocalStrategy)

  // login or create an account in db.
  router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    (req, res) => {
      res
        .status(req.user.status === "LOGIN" || "CREATE" ? 200 : 401)
        .json(req.user)
    }
  )

  return router
}

module.exports = route
