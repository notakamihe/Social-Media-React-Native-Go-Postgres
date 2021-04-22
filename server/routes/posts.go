package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/notakamihe/social-media-app/server/database"
	"github.com/notakamihe/social-media-app/server/models"
	"github.com/notakamihe/social-media-app/server/utils"
)

func getPosts(w http.ResponseWriter, r *http.Request) {
	var posts []interface{}

	result, err := database.DB.Query("SELECT * FROM posts")

	if err != nil {
		log.Fatal(err)
	}

	for result.Next() {
		var post models.Post
		err := result.Scan(&post.ID, &post.UserID, &post.CreatedOn, &post.Category)

		if err != nil {
			log.Fatal(err)
		}

		posts = append(posts, utils.GetAdditionalPostInformation(post))
	}

	json.NewEncoder(w).Encode(posts)
}

func getPost(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM posts WHERE id = $1", params["id"])

	err := row.Scan(&post.ID, &post.UserID, &post.CreatedOn, &post.Category)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find post with id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(utils.GetAdditionalPostInformation(post))
}

func deletePost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	result, err := database.DB.Exec("DELETE FROM posts WHERE id = $1", params["id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete post with id of %s.", params["id"]))
		return
	}

	json.NewEncoder(w).Encode("Post deleted.")
}
