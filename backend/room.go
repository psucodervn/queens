package main

import (
	"encoding/json"
	"net/http"
	"slices"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

type Room struct {
	core.BaseModel
	Name       string                  `json:"name"`
	MaxPlayers int                     `json:"maxPlayers"`
	TimeLimit  int                     `json:"timeLimit"`
	Status     string                  `json:"status"`
	Players    types.JSONArray[string] `json:"players"`
	CreatedBy  string                  `json:"createdBy"`
}

type CreateRoomRequest struct {
	Name       string `json:"name"`
	MaxPlayers int    `json:"maxPlayers"`
	TimeLimit  int    `json:"timeLimit"`
}

func createRoom(e *core.RequestEvent) error {
	var req CreateRoomRequest
	if err := json.NewDecoder(e.Request.Body).Decode(&req); err != nil {
		return e.Error(http.StatusBadRequest, "Invalid request body", err)
	}

	// Set default time limit if not provided
	if req.TimeLimit == 0 {
		req.TimeLimit = 300 // 5 minutes default
	}

	// Create room using direct SQL query like getRandomLevel
	_, err := e.App.DB().NewQuery("INSERT INTO rooms (name, maxPlayers, timeLimit, status, players, createdBy) VALUES ({:name}, {:maxPlayers}, {:timeLimit}, {:status}, {:players}, {:createdBy})").
		Bind(map[string]any{
			"name":       req.Name,
			"maxPlayers": req.MaxPlayers,
			"timeLimit":  req.TimeLimit,
			"status":     "waiting",
			"players":    []string{},
			"createdBy":  e.Request.Header.Get("Authorization"),
		}).
		Execute()

	if err != nil {
		return e.Error(http.StatusInternalServerError, "Failed to create room", err)
	}

	// Get all rooms and return the last one (our newly created room)
	rooms, err := e.App.FindAllRecords("rooms")
	if err != nil {
		return e.Error(http.StatusInternalServerError, "Failed to retrieve created room", err)
	}

	return e.JSON(http.StatusCreated, rooms[len(rooms)-1])
}

func joinRoom(e *core.RequestEvent) error {
	roomId := e.Request.PathValue("roomId")

	// Get room record
	room, err := e.App.FindRecordById("rooms", roomId)
	if err != nil {
		return e.Error(http.StatusNotFound, "Room not found", err)
	}

	// Get current players
	players := room.Get("players").(types.JSONArray[string])
	playerId := e.Request.Header.Get("Authorization")

	// Check if player is already in the room
	if slices.Contains(players, playerId) {
		return e.JSON(http.StatusOK, room)
	}

	// Check if room is full
	if len(players) >= room.Get("maxPlayers").(int) {
		return e.Error(http.StatusConflict, "Room is full", nil)
	}

	// Add player to room using direct SQL query
	_, err = e.App.DB().NewQuery("UPDATE rooms SET players = {:players} WHERE id = {:id}").
		Bind(map[string]any{
			"players": append(players, playerId),
			"id":      roomId,
		}).
		Execute()

	if err != nil {
		return e.Error(http.StatusInternalServerError, "Failed to join room", err)
	}

	// Get updated room
	updatedRoom, err := e.App.FindRecordById("rooms", roomId)
	if err != nil {
		return e.Error(http.StatusInternalServerError, "Failed to retrieve updated room", err)
	}

	return e.JSON(http.StatusOK, updatedRoom)
}

func leaveRoom(e *core.RequestEvent) error {
	roomId := e.Request.PathValue("roomId")

	// Get room record
	room, err := e.App.FindRecordById("rooms", roomId)
	if err != nil {
		return e.Error(http.StatusNotFound, "Room not found", err)
	}

	// Get current players
	players := room.Get("players").(types.JSONArray[string])
	playerId := e.Request.Header.Get("Authorization")

	// Remove player from room
	newPlayers := make(types.JSONArray[string], 0)
	for _, p := range players {
		if p != playerId {
			newPlayers = append(newPlayers, p)
		}
	}

	// Update players using direct SQL query
	_, err = e.App.DB().NewQuery("UPDATE rooms SET players = {:players} WHERE id = {:id}").
		Bind(map[string]any{
			"players": newPlayers,
			"id":      roomId,
		}).
		Execute()

	if err != nil {
		return e.Error(http.StatusInternalServerError, "Failed to leave room", err)
	}

	return e.JSON(http.StatusOK, map[string]string{"message": "Successfully left the room"})
}

func getRoom(e *core.RequestEvent) error {
	roomId := e.Request.PathValue("roomId")

	room, err := e.App.FindRecordById("rooms", roomId)
	if err != nil {
		return e.Error(http.StatusNotFound, "Room not found", err)
	}

	return e.JSON(http.StatusOK, room)
}

func listRooms(e *core.RequestEvent) error {
	rooms, err := e.App.FindAllRecords("rooms")
	if err != nil {
		return e.Error(http.StatusInternalServerError, "Failed to fetch rooms", err)
	}

	return e.JSON(http.StatusOK, rooms)
}
