package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `{
      "id": "pbc_3974744650",
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "name": "solutions",
      "type": "base",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210261",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "text1579384339",
          "max": 0,
          "min": 0,
          "name": "roundId",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "text1579384340",
          "max": 0,
          "min": 0,
          "name": "playerId",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json2985802016",
          "maxSize": 0,
          "name": "board",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "number4156564593",
          "max": null,
          "min": null,
          "name": "timeSpent",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "bool1579384341",
          "name": "isValid",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "number4156564594",
          "max": null,
          "min": null,
          "name": "score",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "autodate2990389181",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "indexes": [
        "CREATE INDEX 'idx_5DXZio2evT' ON 'solutions' ('roundId')",
        "CREATE INDEX 'idx_5DXZio2evU' ON 'solutions' ('playerId')"
      ],
      "system": false
    }`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3974744650")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
