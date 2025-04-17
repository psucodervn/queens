package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3974744648")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"indexes": [
				"CREATE INDEX 'idx_5DXZio2evP' ON 'rooms' ('status')",
				"CREATE INDEX 'idx_5DXZio2evQ' ON 'rooms' ('createdBy')",
				"CREATE UNIQUE INDEX ` + "`" + `idx_IKcGoSU2KV` + "`" + ` ON ` + "`" + `rooms` + "`" + ` (` + "`" + `name` + "`" + `)"
			]
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3974744648")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"indexes": [
				"CREATE INDEX 'idx_5DXZio2evP' ON 'rooms' ('status')",
				"CREATE INDEX 'idx_5DXZio2evQ' ON 'rooms' ('createdBy')"
			]
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
