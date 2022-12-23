migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pjq6rzjozzk4lz")

  collection.deleteRule = "@request.auth.id = message_owner.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pjq6rzjozzk4lz")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
