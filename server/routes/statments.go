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

func getStatements(w http.ResponseWriter, r *http.Request) {
	var statements []models.Statement

	rows, err := database.DB.Query("SELECT * FROM statements")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var statement models.Statement

		err := rows.Scan(&statement.ID, &statement.PostID, &statement.Content, &statement.Views)

		if err != nil {
			log.Fatal(err)
		}

		statements = append(statements, statement)
	}

	json.NewEncoder(w).Encode(statements)
}

func getStatement(w http.ResponseWriter, r *http.Request) {
	var statement models.Statement
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM statements WHERE post_id = $1", params["id"])

	err := row.Scan(&statement.ID, &statement.PostID, &statement.Content, &statement.Views)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find statement with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(statement)
}

func createStatement(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	var statement models.Statement

	data, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Fatal(err)
	}

	json.Unmarshal(data, &post)
	json.Unmarshal(data, &statement)

	post.Category = "statement"

	if statement.Content == "" {
		utils.RespondWStatus(w, 400, "Content of statement must not be blank.")
		return
	} else if len(statement.Content) > 300 {
		utils.RespondWStatus(w, 400, "Content of statement must exceed 300 characters.")
		return
	}

	row := database.DB.QueryRow("INSERT INTO posts (user_id, category) VALUES ($1, $2) RETURNING id", post.UserID, post.Category)

	err = row.Scan(&statement.PostID)

	if err != nil {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find user with id of %v.", post.UserID))
		return
	}

	stmt, err := database.DB.Prepare("INSERT INTO statements (post_id, content, views) VALUES ($1, $2, $3) RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row = stmt.QueryRow(statement.PostID, statement.Content, statement.Views)

	err = row.Scan(&statement.ID, &statement.PostID, &statement.Content, &statement.Views)

	if err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(statement)
}

func updateStatement(w http.ResponseWriter, r *http.Request) {
	var statement models.Statement
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&statement)

	if statement.Content == "" {
		utils.RespondWStatus(w, 400, "Content of statement must not be blank.")
		return
	} else if len(statement.Content) > 300 {
		utils.RespondWStatus(w, 400, "Content of statement must exceed 300 characters.")
		return
	}

	stmt, err := database.DB.Prepare("UPDATE statements SET content = $1, views = $2 WHERE post_id = $3 RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := stmt.QueryRow(statement.Content, statement.Views, params["id"])

	err = row.Scan(&statement.ID, &statement.PostID, &statement.Content, &statement.Views)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find statement with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(statement)
}
