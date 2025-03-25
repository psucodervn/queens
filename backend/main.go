package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "queens/backend/migrations"
)

func main() {
	app := pocketbase.NewWithConfig(pocketbase.Config{})

	// loosely check if it was executed using "go run"
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), false))

		api := se.Router.Group("/api")
		api.GET("/levels", getLevels)
		api.GET("/levels/{id}", getLevel)
		api.GET("/levels/random", getRandomLevel)

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func getLevel(e *core.RequestEvent) error {
	id := e.Request.PathValue("id")
	level, err := e.App.FindRecordById("levels", id)
	if err != nil {
		return e.Error(http.StatusInternalServerError, err.Error(), err)
	}
	return e.JSON(http.StatusOK, level)
}

func getLevels(e *core.RequestEvent) error {
	levels, err := e.App.FindAllRecords("levels")
	if err != nil {
		return e.Error(http.StatusInternalServerError, err.Error(), err)
	}
	return e.JSON(http.StatusOK, levels)
}

func getRandomLevel(e *core.RequestEvent) error {
	var level Level
	err := e.App.DB().NewQuery("SELECT * FROM levels ORDER BY RANDOM() LIMIT 1").One(&level)
	if err != nil {
		return e.Error(http.StatusInternalServerError, err.Error(), err)
	}
	return e.JSON(http.StatusOK, level)
}
