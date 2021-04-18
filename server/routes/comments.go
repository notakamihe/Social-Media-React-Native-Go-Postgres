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

func getComments(w http.ResponseWriter, r *http.Request) {
	var comments []models.Comment

	rows, err := database.DB.Query("SELECT * FROM comments")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var comment models.Comment

		err := rows.Scan(&comment.PostID, &comment.UserID, &comment.Content, &comment.CommentedOn)

		if err != nil {
			log.Fatal(err)
		}

		comments = append(comments, comment)
	}

	json.NewEncoder(w).Encode(comments)
}

func getComment(w http.ResponseWriter, r *http.Request) {
	var comment models.Comment
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM comments WHERE post_id = $1 AND user_id = $2", params["post-id"], params["user-id"])

	err := row.Scan(&comment.PostID, &comment.UserID, &comment.Content, &comment.CommentedOn)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find comment with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(comment)
}

func createComment(w http.ResponseWriter, r *http.Request) {
	var comment models.Comment

	json.NewDecoder(r.Body).Decode(&comment)

	if comment.Content == "" {
		utils.RespondWStatus(w, 400, "Content of comment must not be blank.")
		return
	}

	statement, err := database.DB.Prepare("INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(comment.PostID, comment.UserID, comment.Content)

	err = row.Scan(&comment.PostID, &comment.UserID, &comment.Content, &comment.CommentedOn)

	if err != nil {
		switch sqlError := err.(*pq.Error); sqlError.Code {
		case "23503":
			utils.RespondWStatus(w, 400, "Invalid post or user id.")
			return
		case "23505":
			utils.RespondWStatus(w, 400, fmt.Sprintf("Comment w/ post id of %d and user id of %d already exists", comment.PostID, comment.UserID))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(comment)
}

func updateComment(w http.ResponseWriter, r *http.Request) {
	var comment models.Comment
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&comment)

	if comment.Content == "" {
		utils.RespondWStatus(w, 400, "Content of comment must not be blank.")
		return
	}

	statement, err := database.DB.Prepare("UPDATE comments SET content = $1 WHERE post_id = $2 AND user_id = $3 RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(comment.Content, params["post-id"], params["user-id"])

	err = row.Scan(&comment.PostID, &comment.UserID, &comment.Content, &comment.CommentedOn)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find comment with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(comment)
}

func deleteComment(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := database.DB.Exec("DELETE FROM comments WHERE post_id = $1 AND user_id = $2", params["post-id"], params["user-id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete comment with post id of %s and user id of %s.", params["post-id"], params["user-id"]))
		return
	}

	json.NewEncoder(w).Encode("Comment deleted.")
}
