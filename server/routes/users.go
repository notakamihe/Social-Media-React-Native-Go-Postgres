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
	"regexp"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/notakamihe/social-media-app/server/database"
	"github.com/notakamihe/social-media-app/server/models"
	"github.com/notakamihe/social-media-app/server/utils"
	"golang.org/x/crypto/bcrypt"
)

func signUp(w http.ResponseWriter, r *http.Request) {
	var user models.User

	json.NewDecoder(r.Body).Decode(&user)

	if user.Username == "" {
		utils.RespondWStatus(w, 400, "Username must not be blank")
		return
	}

	if user.Password == "" {
		utils.RespondWStatus(w, 400, "Password must not be blank.")
		return
	} else if len(user.Password) < 8 {
		utils.RespondWStatus(w, 400, "Password must be at least 8 characters.")
		return
	}

	if user.Email == "" {
		utils.RespondWStatus(w, 400, "Email must not be blank.")
		return
	} else {
		matched, err := regexp.Match(`^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)`, []byte(user.Email))

		if err != nil || !matched {
			utils.RespondWStatus(w, 400, "Invalid email.")
			return
		}
	}

	if user.Dob == "" {
		utils.RespondWStatus(w, 400, "Date of birth must not be blank.")
		return
	} else {
		matched, err := regexp.Match(`^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])`, []byte(user.Dob))

		if err != nil || !matched {
			utils.RespondWStatus(w, 400, "Invalid date of birth format (Must be YYYY-MM-DD).")
			return
		}
	}

	if user.Country == "" {
		utils.RespondWStatus(w, 400, "Country must not be blank.")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)

	if err != nil {
		log.Fatal(err)
	}

	statement, err := database.DB.Prepare("INSERT INTO users (username, email, password, dob, country, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(user.Username, user.Email, string(hashedPassword), user.Dob, user.Country, user.Description)

	err = row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Dob, &user.Country, &user.Description, &user.DarkMode, &user.PfpUrl, &user.JoinedOn)

	if err != nil {
		if strings.Contains(err.Error(), "username") {
			utils.RespondWStatus(w, 400, "Username is taken.")
			return
		} else if strings.Contains(err.Error(), "email") {
			utils.RespondWStatus(w, 400, "Email is taken.")
			return
		}
	}

	token, err := utils.CreateToken(user.ID)

	if err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(token)
}

func logIn(w http.ResponseWriter, r *http.Request) {
	var user models.User

	json.NewDecoder(r.Body).Decode(&user)

	if user.Username == "" {
		utils.RespondWStatus(w, 400, "Username must not be blank.")
		return
	}

	password := user.Password

	row := database.DB.QueryRow("SELECT * FROM users WHERE username = $1", user.Username)

	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Dob, &user.Country, &user.Description, &user.DarkMode, &user.PfpUrl, &user.JoinedOn)

	if err != nil {
		if err == sql.ErrNoRows {
			utils.RespondWStatus(w, 400, "Username does not exist.")
			return
		} else {
			log.Fatal(err)
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if err != nil {
		utils.RespondWStatus(w, 401, "Invalid password.")
		return
	}

	token, err := utils.CreateToken(user.ID)

	if err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(token)
}

func getUserByToken(w http.ResponseWriter, r *http.Request) {
	var user models.User

	headerToken := r.Header.Get("Authorization")

	token, err := jwt.Parse(headerToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte("secret"), nil
	})

	if err != nil {
		utils.RespondWStatus(w, 401, err.Error())
		return
	}

	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		utils.RespondWStatus(w, 401, err.Error())
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok && !token.Valid {
		return
	}

	userId, ok := claims["user_id"]

	if !ok {
		utils.RespondWStatus(w, 401, "Could not obtain user id.")
		return
	}

	row := database.DB.QueryRow("SELECT * FROM users WHERE id = $1", userId)

	err = row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Dob, &user.Country, &user.Description, &user.DarkMode, &user.PfpUrl, &user.JoinedOn)

	if err != nil {
		utils.RespondWStatus(w, 401, fmt.Sprintf("Could not find user with id of %s.", userId))
		return
	}

	json.NewEncoder(w).Encode(user)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User

	result, err := database.DB.Query("SELECT * FROM users")

	if err != nil {
		log.Fatal(err)
	}

	for result.Next() {
		var user models.User

		err := result.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Dob, &user.Country, &user.Description, &user.DarkMode, &user.PfpUrl, &user.JoinedOn)

		if err != nil {
			log.Fatal(err)
		}

		users = append(users, user)
	}

	json.NewEncoder(w).Encode(users)
}

func getUserById(w http.ResponseWriter, r *http.Request) {
	var user models.User
	params := mux.Vars(r)

	row := database.DB.QueryRow("SELECT * FROM users WHERE id = $1", params["id"])

	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Dob, &user.Country, &user.Description, &user.DarkMode, &user.PfpUrl, &user.JoinedOn)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not find user with id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(user)
}

func updateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&user)

	if user.Username == "" {
		utils.RespondWStatus(w, 400, "Username must not be blank")
		return
	}

	if user.Email == "" {
		utils.RespondWStatus(w, 400, "Email must not be blank.")
		return
	} else {
		matched, err := regexp.Match(`^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)`, []byte(user.Email))

		if err != nil || !matched {
			utils.RespondWStatus(w, 400, "Invalid email.")
			return
		}
	}

	if user.Dob == "" {
		utils.RespondWStatus(w, 400, "Date of birth must not be blank.")
		return
	} else {
		matched, err := regexp.Match(`^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])`, []byte(user.Dob))

		if err != nil || !matched {
			utils.RespondWStatus(w, 400, "Invalid date of birth format (Must be YYYY-MM-DD).")
			return
		}
	}

	if user.Country == "" {
		utils.RespondWStatus(w, 400, "Country must not be blank.")
		return
	}

	statement, err := database.DB.Prepare("UPDATE users SET username = $1, email = $2, dob = $3, country = $4, description = $5, darkMode = $6 WHERE id = $7 RETURNING *")

	if err != nil {
		log.Fatal(err)
	}

	row := statement.QueryRow(user.Username, user.Email, user.Dob, user.Country, user.Description, user.DarkMode, params["id"])

	err = row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Dob, &user.Country, &user.Description, &user.DarkMode, &user.PfpUrl, &user.JoinedOn)

	if err != nil {
		if strings.Contains(err.Error(), "username") {
			utils.RespondWStatus(w, 400, "Username is taken.")
			return
		} else if strings.Contains(err.Error(), "email") {
			utils.RespondWStatus(w, 400, "Email is taken.")
			return
		}

		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update user with id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(user)
}

func updateUserPassword(w http.ResponseWriter, r *http.Request) {
	var user models.User
	params := mux.Vars(r)

	json.NewDecoder(r.Body).Decode(&user)

	if user.Password == "" {
		utils.RespondWStatus(w, 400, "Password must not be blank.")
		return
	} else if len(user.Password) < 8 {
		utils.RespondWStatus(w, 400, "Password must be at least 8 characters.")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)

	if err != nil {
		log.Fatal(err)
	}

	row := database.DB.QueryRow("UPDATE users SET password = $1 WHERE id = $2 RETURNING *", string(hashedPassword), params["id"])

	err = row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Dob, &user.Country, &user.Description, &user.DarkMode, &user.PfpUrl, &user.JoinedOn)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update password of user with id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	json.NewEncoder(w).Encode(user)
}

func updateUserPfp(w http.ResponseWriter, r *http.Request) {
	var user models.User
	var pfpUrl string
	params := mux.Vars(r)

	r.ParseMultipartForm(16 << 20)

	file, handler, err := r.FormFile("pfp")

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

		pfpUrl = filepath.Join("uploads", "images", time.Now().Format("20060102150405")+handler.Filename)
	}

	row := database.DB.QueryRow("UPDATE users SET pfpurl = $1 WHERE id = $2 RETURNING *", pfpUrl, params["id"])

	err = row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Dob, &user.Country, &user.Description, &user.DarkMode, &user.PfpUrl, &user.JoinedOn)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			utils.RespondWStatus(w, 400, fmt.Sprintf("Could not update pfp of user with id of %s.", params["id"]))
			return
		default:
			log.Fatal(err)
		}
	}

	if handler != nil && file != nil {
		path := filepath.Join("uploads", pfpUrl)

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

	json.NewEncoder(w).Encode(user)
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	result, err := database.DB.Exec("DELETE FROM users WHERE id = $1", params["id"])

	if err != nil {
		log.Fatal(err)
	}

	numRowsAffected, err := result.RowsAffected()

	if err != nil {
		log.Fatal(err)
	}

	if numRowsAffected == 0 {
		utils.RespondWStatus(w, 400, fmt.Sprintf("Could not delete user with id of %s.", params["id"]))
		return
	}

	json.NewEncoder(w).Encode("User deleted.")
}
