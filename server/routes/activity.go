package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/lib/pq"
	"github.com/notakamihe/social-media-app/server/database"
	"github.com/notakamihe/social-media-app/server/models"
	"github.com/notakamihe/social-media-app/server/utils"
)

func getActivities(w http.ResponseWriter, r *http.Request) {
	var activities []models.Activity

	rows, err := database.DB.Query("SELECT * FROM activity")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var activity models.Activity

		err := rows.Scan(&activity.ID, &activity.UserID, &activity.Description, &activity.CreatedAt)

		if err != nil {
			log.Fatal(err)
		}

		activities = append(activities, activity)
	}

	json.NewEncoder(w).Encode(activities)
}

func getActivitiesByUserId(w http.ResponseWriter, r *http.Request) {
	var activities []models.Activity
	params := mux.Vars(r)

	rows, err := database.DB.Query("SELECT * FROM activity WHERE user_id = $1", params["id"])

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var activity models.Activity

		err := rows.Scan(&activity.ID, &activity.UserID, &activity.Description, &activity.CreatedAt)

		if err != nil {
			log.Fatal(err)
		}

		activities = append(activities, activity)
	}

	json.NewEncoder(w).Encode(activities)
}

func getActivity(w http.ResponseWriter, r *http.Request) {
	var activity models.Activity
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM activity WHERE id = $1", params["id"])
	err := row.Scan(&activity.ID, &activity.UserID, &activity.Description, &activity.CreatedAt)

	switch err {
	case nil:
		break
	case sql.ErrNoRows:
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find activity with id of %s.", params["id"]))
		return
	default:
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(activity)
}

func createActivity(w http.ResponseWriter, r *http.Request) {
	var activity models.Activity

	json.NewDecoder(r.Body).Decode(&activity)

	if activity.Description == "" {
		utils.RespondWStatus(w, 400, "Activity description must not be blank.")
		return
	}

	statement, err := database.DB.Prepare("INSERT INTO activity (user_id, description) VALUES ($1, $2) RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(activity.UserID, activity.Description)

	err = row.Scan(&activity.ID, &activity.UserID, &activity.Description, &activity.CreatedAt)

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find user with id of %d.", activity.UserID))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(activity)
}

func updateActivity(w http.ResponseWriter, r *http.Request) {
	var activity models.Activity
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&activity)

	if activity.Description == "" {
		utils.RespondWStatus(w, 400, "Activity description must not be blank.")
		return
	}

	statement, err := database.DB.Prepare("UPDATE activity SET user_id = $1, description = $2 WHERE id = $3 RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(activity.UserID, activity.Description, params["id"])

	err = row.Scan(&activity.ID, &activity.UserID, &activity.Description, &activity.CreatedAt)

	switch err {
	case nil:
		break
	case sql.ErrNoRows:
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find activity with id of %s.", params["id"]))
		return
	default:
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find user with id of %d.", activity.UserID))
			return
		}

		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(activity)
}

func deleteActivity(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := database.DB.Exec("DELETE FROM activity WHERE id = $1", params["id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete activity with id of %s.", params["id"]))
		return
	}

	json.NewEncoder(w).Encode("Activity deleted.")
}
