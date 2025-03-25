package main

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

type Level struct {
	core.BaseModel
	Name         string                                   `json:"name"`
	Size         int                                      `json:"size"`
	ColorRegions types.JSONArray[types.JSONArray[string]] `db:"colorRegions" json:"colorRegions"`
	RegionColors types.JSONMap[string]                    `db:"regionColors" json:"regionColors"`
}
