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

func getFavorites(w http.ResponseWriter, r *http.Request) {
	var favorites []models.Favorite

	rows, err := database.DB.Query("SELECT * FROM favorites")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var favorite models.Favorite

		err := rows.Scan(&favorite.PostID, &favorite.UserID)

		if err != nil {
			log.Fatal(err)
		}

		favorites = append(favorites, favorite)
	}

	json.NewEncoder(w).Encode(favorites)
}

func getFavorite(w http.ResponseWriter, r *http.Request) {
	var favorite models.Favorite
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM favorites WHERE post_id = $1 AND user_id = $2", params["post-id"], params["user-id"])

	err := row.Scan(&favorite.PostID, &favorite.UserID)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find favorite with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(favorite)
}

func createFavorite(w http.ResponseWriter, r *http.Request) {
	var favorite models.Favorite

	json.NewDecoder(r.Body).Decode(&favorite)

	_, err := database.DB.Exec("INSERT INTO favorites VALUES ($1, $2)", favorite.PostID, favorite.UserID)

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid post or user id.")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Favorite w/ post id of %d and user id of %d already exists", favorite.PostID, favorite.UserID))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(favorite)
}

func updateFavorite(w http.ResponseWriter, r *http.Request) {
	var favorite models.Favorite
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&favorite)

	statement, err := database.DB.Prepare("UPDATE favorites SET post_id = $1, user_id = $2 WHERE post_id = $3 AND user_id = $4")

	if err != nil {
		log.Fatal(err)
	}

	result, err := statement.Exec(favorite.PostID, favorite.UserID, params["post-id"], params["user-id"])

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid post or user id.")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Favorite w/ post id of %d and user id of %d already exists", favorite.PostID, favorite.UserID))
			return
		default:
			log.Fatal(err)
		}
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update favorite with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
		return
	}

	json.NewEncoder(w).Encode(favorite)
}

func deleteFavorite(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := database.DB.Exec("DELETE FROM favorites WHERE post_id = $1 AND user_id = $2", params["post-id"], params["user-id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete favorite with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
		return
	}

	json.NewEncoder(w).Encode("Favorite deleted.")
}
