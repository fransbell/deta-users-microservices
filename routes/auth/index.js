const express = require("express")

const route = (deta) => {
  const router = express.Router()
  const session = deta.Base("session")

  router.post("/verify", async (req, res) => {
    const { tokenId } = req.body
    const exist = await session.get(tokenId).catch((err) => {
      res.json({ msg: `unauthorized` })
    })
    if (exist) {
      const { key, userId, expired, created } = exist
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
