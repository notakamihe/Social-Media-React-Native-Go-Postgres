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

func getFollows(w http.ResponseWriter, r *http.Request) {
	var follows []models.Follow

	rows, err := database.DB.Query("SELECT * FROM follows")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var follow models.Follow

		err := rows.Scan(&follow.Followed, &follow.Follower)

		if err != nil {
			log.Fatal(err)
		}

		follows = append(follows, follow)
	}

	json.NewEncoder(w).Encode(follows)
}

func getFollow(w http.ResponseWriter, r *http.Request) {
	var follow models.Follow
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM follows WHERE followed_user_id = $1 AND follower_user_id = $2", params["followed-id"], params["follower-id"])

	err := row.Scan(&follow.Followed, &follow.Follower)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find follow with followed id of %s and follower id of %s.", params["followed-id"], params["follower-id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(follow)
}

func createFollow(w http.ResponseWriter, r *http.Request) {
	var follow models.Follow

	json.NewDecoder(r.Body).Decode(&follow)

	_, err := database.DB.Exec("INSERT INTO follows VALUES ($1, $2)", follow.Followed, follow.Follower)

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid user id(s).")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Follow w/ followed id of %d and follower id of %d already exists", follow.Followed, follow.Follower))
			return
		case "23514":
			utils.RespondWStatus(w, 400, "User ids must not match")
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(follow)
}

func updateFollow(w http.ResponseWriter, r *http.Request) {
	var follow models.Follow
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&follow)

	statement, err := database.DB.Prepare("UPDATE follows SET followed_user_id = $1, follower_user_id = $2 WHERE followed_user_id = $3 AND follower_user_id = $4")

	if err != nil {
		log.Fatal(err)
	}

	result, err := statement.Exec(follow.Followed, follow.Follower, params["followed-id"], params["follower-id"])

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid user id(s).")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Follow w/ followed id of %d and follower id of %d already exists", follow.Followed, follow.Follower))
			return
		case "23514":
			utils.RespondWStatus(w, 400, "User ids must not match")
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
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update follow with followed id of %s and follower id of %s.", params["followed-id"], params["follower-id"]))
		return
	}

	json.NewEncoder(w).Encode(follow)
}

func deleteFollow(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := database.DB.Exec("DELETE FROM follows WHERE followed_user_id = $1 AND follower_user_id = $2", params["followed-id"], params["follower-id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete follow with followed id of %s and follower id of %s.", params["followed-id"], params["follower-id"]))
		return
	}

	json.NewEncoder(w).Encode("Follow deleted.")
}
