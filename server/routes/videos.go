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

func getVideos(w http.ResponseWriter, r *http.Request) {
	var videos []models.Video

	rows, err := database.DB.Query("SELECT * FROM videos")

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		var video models.Video

		err := rows.Scan(&video.ID, &video.PostID, &video.Title, &video.Description, &video.Views, &video.Private, &video.FileUrl, &video.ThumbnailUrl)

		if err != nil {
			log.Fatal(err)
		}

		videos = append(videos, video)
	}

	json.NewEncoder(w).Encode(videos)
}

func getVideo(w http.ResponseWriter, r *http.Request) {
	var video models.Video
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM videos WHERE post_id = $1", params["id"])

	err := row.Scan(&video.ID, &video.PostID, &video.Title, &video.Description, &video.Views, &video.Private, &video.FileUrl, &video.ThumbnailUrl)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find video with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(video)
}

func createVideo(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	var video models.Video

	data, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Fatal(err)
	}

	json.Unmarshal(data, &post)
	json.Unmarshal(data, &video)

	post.Category = "video"

	if video.Title == "" {
		utils.RespondWStatus(w, 400, "Video title must not be blank.")
		return
	}

	row := database.DB.QueryRow("INSERT INTO posts (user_id, category) VALUES ($1, $2) RETURNING id", post.UserID, post.Category)

	err = row.Scan(&video.PostID)

	if err != nil {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find user with id of %v.", post.UserID))
		return
	}

	statement, err := database.DB.Prepare("INSERT INTO videos (post_id, title, description, views, private) VALUES ($1, $2, $3, $4, $5) RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row = statement.QueryRow(video.PostID, video.Title, video.Description, video.Views, video.Private)

	err = row.Scan(&video.ID, &video.PostID, &video.Title, &video.Description, &video.Views, &video.Private, &video.FileUrl, &video.ThumbnailUrl)

	if err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(video)
}

func updateVideo(w http.ResponseWriter, r *http.Request) {
	var video models.Video
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&video)

	if video.Title == "" {
		utils.RespondWStatus(w, 400, "Title must not be blank.")
		return
	}

	statement, err := database.DB.Prepare("UPDATE videos SET title = $1, description = $2, views = $3, private = $4 WHERE post_id = $5 RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(video.Title, video.Description, video.Views, video.Private, params["id"])

	err = row.Scan(&video.ID, &video.PostID, &video.Title, &video.Description, &video.Views, &video.Private, &video.FileUrl, &video.ThumbnailUrl)

	if err != nil {
		if err != nil {
			switch err {
			case sql.ErrNoRows:
				utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find video with post id of %s.", params["id"]))
				return
			default:
				log.Fatal(err)
			}
		}
	}

	json.NewEncoder(w).Encode(video)
}

func updateVideoFile(w http.ResponseWriter, r *http.Request) {
	var video models.Video
	var fileUrl string
	params := mux.Vars(r)

	r.ParseMultipartForm(1000 << 20)

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
		if !strings.Contains(handler.Header.Get("Content-Type"), "video") {
			utils.RespondWStatus(w, 400, "Invalid media type. Must be video.")
			return
		}

		fileUrl = filepath.Join("uploads", "videos", time.Now().Format("20060102150405")+handler.Filename)
	}

	row := database.DB.QueryRow("UPDATE videos SET fileurl = $1 WHERE post_id = $2 RETURNING *", fileUrl, params["id"])

	err = row.Scan(&video.ID, &video.PostID, &video.Title, &video.Description, &video.Views, &video.Private, &video.FileUrl, &video.ThumbnailUrl)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update file of video with post id of %s.", params["id"]))
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

	json.NewEncoder(w).Encode(video)
}

func updateVideoThumbnail(w http.ResponseWriter, r *http.Request) {
	var video models.Video
	var thumbnailUrl string
	params := mux.Vars(r)

	r.ParseMultipartForm(16 << 20)

	file, handler, err := r.FormFile("thumbnail")

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

		thumbnailUrl = filepath.Join("uploads", "images", time.Now().Format("20060102150405")+handler.Filename)
	}

	row := database.DB.QueryRow("UPDATE videos SET thumbnailurl = $1 WHERE post_id = $2 RETURNING *", thumbnailUrl, params["id"])

	err = row.Scan(&video.ID, &video.PostID, &video.Title, &video.Description, &video.Views, &video.Private, &video.FileUrl, &video.ThumbnailUrl)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update thumbnail of video with post id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	if file != nil {
		path := filepath.Join("uploads", thumbnailUrl)
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

	json.NewEncoder(w).Encode(video)
}
