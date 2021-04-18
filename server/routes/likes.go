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

func getLikes(w http.ResponseWriter, r *http.Request) {
	var likes []models.Like

	rows, err := database.DB.Query("SELECT * FROM likes")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var like models.Like

		err := rows.Scan(&like.PostID, &like.UserID)

		if err != nil {
			log.Fatal(err)
		}

		likes = append(likes, like)
	}

	json.NewEncoder(w).Encode(likes)
}

func getLike(w http.ResponseWriter, r *http.Request) {
	var like models.Like
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM likes WHERE post_id = $1 AND user_id = $2", params["post-id"], params["user-id"])

	err := row.Scan(&like.PostID, &like.UserID)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find like with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(like)
}

func createLike(w http.ResponseWriter, r *http.Request) {
	var like models.Like

	json.NewDecoder(r.Body).Decode(&like)

	_, err := database.DB.Exec("INSERT INTO likes VALUES ($1, $2)", like.PostID, like.UserID)

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid post or user id.")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Like w/ post id of %d and user id of %d already exists", like.PostID, like.UserID))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(like)
}

func updateLike(w http.ResponseWriter, r *http.Request) {
	var like models.Like
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&like)

	statement, err := database.DB.Prepare("UPDATE likes SET post_id = $1, user_id = $2 WHERE post_id = $3 AND user_id = $4")

	if err != nil {
		log.Fatal(err)
	}

	result, err := statement.Exec(like.PostID, like.UserID, params["post-id"], params["user-id"])

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid post or user id.")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Like w/ post id of %d and user id of %d already exists", like.PostID, like.UserID))
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
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update like with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
		return
	}

	json.NewEncoder(w).Encode(like)
}

func deleteLike(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := database.DB.Exec("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", params["post-id"], params["user-id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete like with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
		return
	}

	json.NewEncoder(w).Encode("Like deleted.")
}
