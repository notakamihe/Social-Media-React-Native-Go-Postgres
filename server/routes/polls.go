package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/notakamihe/social-media-app/server/database"
	"github.com/notakamihe/social-media-app/server/models"
	"github.com/notakamihe/social-media-app/server/utils"
)

func getPolls(w http.ResponseWriter, r *http.Request) {
	var polls []models.Poll

	rows, err := database.DB.Query("SELECT * FROM polls")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var poll models.Poll

		err := rows.Scan(&poll.ID, &poll.PostID, &poll.Title, &poll.Description)

		if err != nil {
			log.Fatal(err)
		}

		polls = append(polls, poll)
	}

	json.NewEncoder(w).Encode(polls)
}

func getPoll(w http.ResponseWriter, r *http.Request) {
	var poll models.Poll
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM polls WHERE post_id = $1", params["id"])

	err := row.Scan(&poll.ID, &poll.PostID, &poll.Title, &poll.Description)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find poll with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(poll)
}

func createPoll(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	var poll models.Poll

	data, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Fatal(err)
	}

	json.Unmarshal(data, &post)
	json.Unmarshal(data, &poll)

	post.Category = "poll"

	if poll.Title == "" {
		utils.RespondWStatus(w, 400, "Poll title must not be blank.")
		return
	}

	row := database.DB.QueryRow("INSERT INTO posts (user_id, category) VALUES ($1, $2) RETURNING id", post.UserID, post.Category)

	err = row.Scan(&poll.PostID)

	if err != nil {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find user with id of %v.", post.UserID))
		return
	}

	stmt, err := database.DB.Prepare("INSERT INTO polls (post_id, title, description) VALUES ($1, $2, $3) RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row = stmt.QueryRow(poll.PostID, poll.Title, poll.Description)

	err = row.Scan(&poll.ID, &poll.PostID, &poll.Title, &poll.Description)

	if err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(poll)
}

func updatePoll(w http.ResponseWriter, r *http.Request) {
	var poll models.Poll
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&poll)

	if poll.Title == "" {
		utils.RespondWStatus(w, 400, "Poll title must not be blank.")
		return
	}

	stmt, err := database.DB.Prepare("UPDATE polls SET title = $1, description = $2 WHERE post_id = $3 RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := stmt.QueryRow(poll.Title, poll.Description, params["id"])

	err = row.Scan(&poll.ID, &poll.PostID, &poll.Title, &poll.Description)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find poll with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(poll)
}
