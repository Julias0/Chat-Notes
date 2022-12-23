migrate((db) => {
  const collection = new Collection({
    "id": "4pjq6rzjozzk4lz",
    "created": "2022-12-23 10:52:55.518Z",
    "updated": "2022-12-23 10:52:55.518Z",
    "name": "note",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "kokk3vqv",
        "name": "main_message",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "yedlgssv",
        "name": "favourite",
        "type": "bool",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "n3rvzm3b",
        "name": "soft_deleted",
        "type": "bool",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "2x7ahmtz",
        "name": "message_owner",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false
        }
      }
    ],
    "listRule": "@request.auth.id = message_owner.id",
    "viewRule": "@request.auth.id = message_owner.id",
    "createRule": "@request.auth.id = message_owner.id",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4pjq6rzjozzk4lz");

  return dao.deleteCollection(collection);
})
