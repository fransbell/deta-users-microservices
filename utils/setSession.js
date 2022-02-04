const crypto = require("crypto")

const generateUniqueUUID = async (db) => {
  const uuid = crypto.randomUUID()
  const exist = await db.get(uuid)
  if (exist) {
    return generateUniqueUUID(db)
  } else {
    return uuid
  }
}

const setSession = async (db, userId) => {
  const fetch = await db.fetch({ userId: userId })
  if (fetch.count) {
    await db.delete(fetch.items[0].key)
    return generateUniqueUUID(db)
  } else {
    return generateUniqueUUID(db)
  }
}

module.exports = { setSession, generateUniqueUUID }
