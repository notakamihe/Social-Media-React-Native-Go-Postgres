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

func getPollOptions(w http.ResponseWriter, r *http.Request) {
	var pollOptions []models.PollOption

	rows, err := database.DB.Query("SELECT * FROM poll_options")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var pollOption models.PollOption

		err := rows.Scan(&pollOption.ID, &pollOption.PollID, &pollOption.Label)

		if err != nil {
			log.Fatal(err)
		}

		pollOptions = append(pollOptions, pollOption)
	}

	json.NewEncoder(w).Encode(pollOptions)
}

func getPollOption(w http.ResponseWriter, r *http.Request) {
	var pollOption models.PollOption
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM poll_options WHERE id = $1", params["id"])

	err := row.Scan(&pollOption.ID, &pollOption.PollID, &pollOption.Label)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find poll option with id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(pollOption)
}

func getPollOptionsByPollId(w http.ResponseWriter, r *http.Request) {
	var pollOptions []models.PollOption
	params := mux.Vars(r)

	rows, err := database.DB.Query("SELECT * FROM poll_options WHERE poll_id = $1", params["id"])

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var pollOption models.PollOption

		err := rows.Scan(&pollOption.ID, &pollOption.PollID, &pollOption.Label)

		if err != nil {
			log.Fatal(err)
		}

		pollOptions = append(pollOptions, pollOption)
	}

	json.NewEncoder(w).Encode(pollOptions)
}

func createPollOption(w http.ResponseWriter, r *http.Request) {
	var pollOption models.PollOption

	json.NewDecoder(r.Body).Decode(&pollOption)

	if pollOption.Label == "" {
		utils.RespondWStatus(w, 400, "Option label must not be blank.")
		return
	} else if len(pollOption.Label) > 100 {
		utils.RespondWStatus(w, 400, "Option label must not exceed 100 characters.")
		return
	}

	statement, err := database.DB.Prepare("INSERT INTO poll_options (poll_id, label) VALUES ($1, $2) RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(pollOption.PollID, pollOption.Label)

	err = row.Scan(&pollOption.ID, &pollOption.PollID, &pollOption.Label)

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find poll with id of %d.", pollOption.PollID))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(pollOption)
}

func updatePollOption(w http.ResponseWriter, r *http.Request) {
	var pollOption models.PollOption
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&pollOption)

	if pollOption.Label == "" {
		utils.RespondWStatus(w, 400, "Option label must not be blank.")
		return
	} else if len(pollOption.Label) > 100 {
		utils.RespondWStatus(w, 400, "Option label must not exceed 100 characters.")
		return
	}

	row := database.DB.QueryRow("UPDATE poll_options SET label = $1 WHERE id = $2 RETURNING *", pollOption.Label, params["id"])

	err := row.Scan(&pollOption.ID, &pollOption.PollID, &pollOption.Label)

	switch err {
	case nil:
		break
	case sql.ErrNoRows:
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find poll option with id of %s.", params["id"]))
		return
	default:
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(pollOption)
}

func deletePollOption(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := database.DB.Exec("DELETE FROM poll_options WHERE id = $1", params["id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete poll option with id of %s.", params["id"]))
		return
	}

	json.NewEncoder(w).Encode("Poll option deleted.")
}
