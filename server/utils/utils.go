package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/notakamihe/social-media-app/server/database"
	"github.com/notakamihe/social-media-app/server/models"
)

func CreateToken(id int64) (string, error) {
	var err error

	atClaims := jwt.MapClaims{}

	atClaims["authorized"] = true
	atClaims["user_id"] = id
	atClaims["exp"] = time.Now().Add(time.Minute * 1440).Unix()

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)

	token, err := at.SignedString([]byte("secret"))

	if err != nil {
		return "", err
	}

	return token, nil
}

func RespondWStatus(w http.ResponseWriter, status int, res string) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(res)
}

func GetAdditionalPostInformation(post models.Post) map[string]interface{} {
	var schema string

	switch post.Category {
	case "video":
		schema = "videos"
		break
	case "photo":
		schema = "photos"
		break
	case "statement":
		schema = "statements"
		break
	case "poll":
		schema = "polls"
		break
	}

	resultMap := make(map[string]interface{})
	rows, _ := database.DB.Query(fmt.Sprintf("SELECT * FROM %s WHERE post_id = $1", schema), post.ID)
	columns, _ := rows.Columns()

	for rows.Next() {
		values := make([]interface{}, len(columns))
		pointers := make([]interface{}, len(columns))

		for i := range values {
			pointers[i] = &values[i]
		}
		_ = rows.Scan(pointers...)

		for i, v := range values {
			resultMap[columns[i]] = v
		}
	}

	resultMap["post"] = post

	return resultMap
}
