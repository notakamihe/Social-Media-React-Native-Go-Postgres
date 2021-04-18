package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	_ "github.com/lib/pq"
	"github.com/notakamihe/social-media-app/server/database"
	"github.com/notakamihe/social-media-app/server/routes"
)

var err error

func main() {
	database.DB, err = sql.Open("postgres", "host=localhost port=5432 user=postgres "+
		"password=Akamihe2004! dbname=social_media sslmode=disable")

	if err != nil {
		log.Fatal(err)
	}

	defer database.DB.Close()

	if err = database.DB.Ping(); err != nil {
		fmt.Println("Could not connect to postgres database.")
		log.Fatal(err)
	}

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	r := routes.NewRouter()

	fmt.Println("Server started")
	log.Fatal(http.ListenAndServe(":9000", handlers.CORS(headers, methods, origins)(r)))
}
