const express = require("express")
const bcrypt = require("bcrypt")
const setSession = require("../utils/setSession")
const crypto = require("crypto")

const route = (deta) => {
  const router = express.Router()
  const users = deta.Base("users")
  const session = deta.Base("session")

  router.post("/create", async (req, res) => {
    const { username, password, email } = req.body
    const exist = await users.fetch({ username: username })
    if (!exist.count) {
      // save new user
      const hashed = bcrypt.hashSync(password, 8)
      const generateUniqueUUID = async (db) => {
        const uuid = crypto.randomUUID()
        const exist = await db.get(uuid)
        if (exist) {
          return generateUniqueUUID(db)
        } else {
          return uuid
        }
      }
      const key = await generateUniqueUUID(users)
      await users.put({ key, email, username, password: hashed })

      res.json({ key, email, username })
    } else {
      // user with the same name exist
      res.json({ msg: `user ${username} already existed` })
    }
  })

  router.post("/login", async (req, res) => {
    const { username, password } = req.body
    const fetch = await users.fetch({ username: username })
    if (fetch.count) {
      const verify = bcrypt.compareSync(password, fetch.items[0].password)
      if (verify) {
        const userId = fetch.items[0].key
        const sessionId = await setSession(session, userId)
        const config = {
          key: sessionId,
          userId: userId,
          created: Date.now(),
          expired: Date.now() + 1000 * 60 * 60 * 24 * 7,
        }
        await session.put(config)
        res.status(200).json({
          sessionId: config.key,
          userId: config.userId,
          created: config.created,
          expired: config.expired,
        })
      } else {
        res.status(500).json({})
      }
    } else {
      // user with the same name exist
      res.json({ msg: `user ${username} does not existed` })
    }
  })

  router.post("/verify", async (req, res) => {
    const { tokenId } = req.body
    const exist = await session.get(tokenId).catch((err) => {
      res.json({ msg: `unauthorized` })
    })
    if (exist) {
      const { key, userId, expired, created } = exist
      console.log(exist)
      res.json({
        is_valid: expired - Date.now() > 0 ? true : false,
        session: {
          sessionId: key,
          userId,
          created,
          expired,
        },
      })
    } else {
      res.json({ msg: `unauthorized token` })
    }
  })

  router.post("/logout", async (req, res) => {
    const { tokenId } = req.body
    const exist = await session.get(tokenId)
    if (exist) {
      await session.delete(tokenId)
      res.json({ status: "logged out" })
    } else {
      res.json({ status: "unauthorized" })
    }
  })

  return router
}

module.exports = route
