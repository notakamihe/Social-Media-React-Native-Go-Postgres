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

func getPollOptionVotes(w http.ResponseWriter, r *http.Request) {
	var pollOptionVotes []models.PollOptionVote

	rows, err := database.DB.Query("SELECT * FROM poll_option_votes")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var pollOptionVote models.PollOptionVote

		err := rows.Scan(&pollOptionVote.PollOptionID, &pollOptionVote.UserID)

		if err != nil {
			log.Fatal(err)
		}

		pollOptionVotes = append(pollOptionVotes, pollOptionVote)
	}

	json.NewEncoder(w).Encode(pollOptionVotes)
}

func getPollOptionVote(w http.ResponseWriter, r *http.Request) {
	var pollOptionVote models.PollOptionVote
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM poll_option_votes WHERE poll_option_id = $1 AND user_id = $2", params["poll-option-id"], params["user-id"])

	err := row.Scan(&pollOptionVote.PollOptionID, &pollOptionVote.UserID)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find poll option vote with poll option id of %s and user id of %s.", params["poll-option-id"], params["user-id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(pollOptionVote)
}

func createPollOptionVote(w http.ResponseWriter, r *http.Request) {
	var pollOptionVote models.PollOptionVote

	json.NewDecoder(r.Body).Decode(&pollOptionVote)

	_, err := database.DB.Exec("INSERT INTO poll_option_votes VALUES ($1, $2)", pollOptionVote.PollOptionID, pollOptionVote.UserID)

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid poll option or user id.")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Vote w/ post option id of %d and user id of %d already exists", pollOptionVote.PollOptionID, pollOptionVote.UserID))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(pollOptionVote)
}

func updatePollOptionVote(w http.ResponseWriter, r *http.Request) {
	var pollOptionVote models.PollOptionVote
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&pollOptionVote)

	statement, err := database.DB.Prepare("UPDATE poll_option_votes SET poll_option_id = $1, user_id = $2 WHERE poll_option_id = $3 AND user_id = $4")

	if err != nil {
		log.Fatal(err)
	}

	result, err := statement.Exec(pollOptionVote.PollOptionID, pollOptionVote.UserID, params["poll-option-id"], params["user-id"])

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid poll option or user id.")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Vote w/ post option id of %d and user id of %d already exists", pollOptionVote.PollOptionID, pollOptionVote.UserID))
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
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update poll option vote with poll option id of %s and user id of %s.", params["poll-option-id"], params["user-id"]))
		return
	}

	json.NewEncoder(w).Encode(pollOptionVote)
}

func deletePollOptionVote(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := database.DB.Exec("DELETE FROM poll_option_votes WHERE poll_option_id = $1 AND user_id = $2", params["poll-option-id"], params["user-id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete poll option vote with poll option id of %s and user id of %s.", params["poll-option-id"], params["user-id"]))
		return
	}

	json.NewEncoder(w).Encode("Vote deleted.")
}
