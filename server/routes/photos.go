package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/notakamihe/social-media-app/server/database"
	"github.com/notakamihe/social-media-app/server/models"
	"github.com/notakamihe/social-media-app/server/utils"
)

func getPhotos(w http.ResponseWriter, r *http.Request) {
	var photos []models.Photo

	rows, err := database.DB.Query("SELECT * FROM photos")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var photo models.Photo

		err := rows.Scan(&photo.ID, &photo.PostID, &photo.Title, &photo.Description, &photo.Views, &photo.Private, &photo.FileUrl)

		if err != nil {
			log.Fatal(err)
		}

		photos = append(photos, photo)
	}

	json.NewEncoder(w).Encode(photos)
}

func getPhoto(w http.ResponseWriter, r *http.Request) {
	var photo models.Photo
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM photos WHERE post_id = $1", params["id"])

	err := row.Scan(&photo.ID, &photo.PostID, &photo.Title, &photo.Description, &photo.Views, &photo.Private, &photo.FileUrl)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find photo with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(photo)
}

func createPhoto(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	var photo models.Photo

	data, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Fatal(err)
	}

	json.Unmarshal(data, &post)
	json.Unmarshal(data, &photo)

	post.Category = "photo"

	if photo.Title == "" {
		utils.RespondWStatus(w, 400, "Photo title must not be blank.")
		return
	}

	row := database.DB.QueryRow("INSERT INTO posts (user_id, category) VALUES ($1, $2) RETURNING id", post.UserID, post.Category)

	err = row.Scan(&photo.PostID)

	if err != nil {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find user with id of %v.", post.UserID))
		return
	}

	statement, err := database.DB.Prepare("INSERT INTO photos (post_id, title, description, views, private) VALUES ($1, $2, $3, $4, $5) RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row = statement.QueryRow(photo.PostID, photo.Title, photo.Description, photo.Views, photo.Private)

	err = row.Scan(&photo.ID, &photo.PostID, &photo.Title, &photo.Description, &photo.Views, &photo.Private, &photo.FileUrl)

	if err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(photo)
}

func updatePhoto(w http.ResponseWriter, r *http.Request) {
	var photo models.Photo
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&photo)

	if photo.Title == "" {
		utils.RespondWStatus(w, 400, "Photo title must not be blank.")
		return
	}

	statement, err := database.DB.Prepare("UPDATE photos SET title = $1, description = $2, views = $3, private = $4 WHERE post_id = $5 RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(photo.Title, photo.Description, photo.Views, photo.Private, params["id"])

	err = row.Scan(&photo.ID, &photo.PostID, &photo.Title, &photo.Description, &photo.Views, &photo.Private, &photo.FileUrl)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find photo with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(photo)
}

func updatePhotoFile(w http.ResponseWriter, r *http.Request) {
	var photo models.Photo
	var fileUrl string
	params := mux.Vars(r)

	r.ParseMultipartForm(16 << 20)

	file, handler, err := r.FormFile("file")

	if err != nil {
		if file != nil {
			utils.RespondWStatus(w, 400, "Error retrieving file.")
			return
		}
	}

	if file != nil {
		defer file.Close()
	}

	if handler != nil {
		if !strings.Contains(handler.Header.Get("Content-Type"), "image") {
			utils.RespondWStatus(w, 400, "Invalid media type. Must be image.")
			return
		}

		fileUrl = filepath.Join("uploads", "images", time.Now().Format("20060102150405")+handler.Filename)
	}

	row := database.DB.QueryRow("UPDATE photos SET fileurl = $1 WHERE post_id = $2 RETURNING *", fileUrl, params["id"])

	err = row.Scan(&photo.ID, &photo.PostID, &photo.Title, &photo.Description, &photo.Views, &photo.Private, &photo.FileUrl)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update file of photo with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	if file != nil {
		path := filepath.Join("uploads", fileUrl)
		newFile, err := os.Create(path)

		if err != nil {
			log.Fatal(err)
		}

		defer newFile.Close()

		bytes, err := ioutil.ReadAll(file)

		if err != nil {
			log.Fatal(err)
		}

		newFile.Write(bytes)
	}

	json.NewEncoder(w).Encode(photo)
}
