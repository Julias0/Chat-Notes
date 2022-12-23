migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pjq6rzjozzk4lz")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yedlgssv",
    "name": "favourite",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n3rvzm3b",
    "name": "soft_deleted",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pjq6rzjozzk4lz")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yedlgssv",
    "name": "favourite",
    "type": "bool",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n3rvzm3b",
    "name": "soft_deleted",
    "type": "bool",
    "required": true,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
