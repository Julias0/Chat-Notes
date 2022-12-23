migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pjq6rzjozzk4lz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qkmgrnux",
    "name": "created_time",
    "type": "date",
    "required": true,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4pjq6rzjozzk4lz")

  // remove
  collection.schema.removeField("qkmgrnux")

  return dao.saveCollection(collection)
})
