package routes

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	router := mux.NewRouter()

	router.PathPrefix("/uploads").Handler(http.StripPrefix("", http.FileServer(http.Dir("uploads/"))))

	router.HandleFunc("/signup", signUp).Methods("POST")
	router.HandleFunc("/login", logIn).Methods("POST")
	router.HandleFunc("/user", getUserByToken).Methods("GET")
	router.HandleFunc("/users", getUsers).Methods("GET")
	router.HandleFunc("/users/{id}", getUserById).Methods("GET")
	router.HandleFunc("/users/{id}", updateUser).Methods("PUT")
	router.HandleFunc("/users/{id}/password", updateUserPassword).Methods("PUT")
	router.HandleFunc("/users/{id}/pfp", updateUserPfp).Methods("PUT")
	router.HandleFunc("/users/{id}", deleteUser).Methods("DELETE")

	router.HandleFunc("/posts", getPosts).Methods("GET")
	router.HandleFunc("/posts/{id}", getPost).Methods("GET")
	router.HandleFunc("/posts/{id}", deletePost).Methods("DELETE")

	router.HandleFunc("/videos", getVideos).Methods("GET")
	router.HandleFunc("/videos/{id}", getVideo).Methods("GET")
	router.HandleFunc("/videos", createVideo).Methods("POST")
	router.HandleFunc("/videos/{id}", updateVideo).Methods("PUT")
	router.HandleFunc("/videos/{id}/file", updateVideoFile).Methods("PUT")
	router.HandleFunc("/videos/{id}/thumbnail", updateVideoThumbnail).Methods("PUT")

	router.HandleFunc("/photos", getPhotos).Methods("GET")
	router.HandleFunc("/photos/{id}", getPhoto).Methods("GET")
	router.HandleFunc("/photos", createPhoto).Methods("POST")
	router.HandleFunc("/photos/{id}", updatePhoto).Methods("PUT")
	router.HandleFunc("/photos/{id}/file", updatePhotoFile).Methods("PUT")

	router.HandleFunc("/statements", getStatements).Methods("GET")
	router.HandleFunc("/statements/{id}", getStatement).Methods("GET")
	router.HandleFunc("/statements", createStatement).Methods("POST")
	router.HandleFunc("/statements/{id}", updateStatement).Methods("PUT")

	router.HandleFunc("/polls", getPolls).Methods("GET")
	router.HandleFunc("/polls/{id}", getPoll).Methods("GET")
	router.HandleFunc("/polls", createPoll).Methods("POST")
	router.HandleFunc("/polls/{id}", updatePoll).Methods("PUT")

	router.HandleFunc("/poll-options", getPollOptions).Methods("GET")
	router.HandleFunc("/poll-options/{id}", getPollOption).Methods("GET")
	router.HandleFunc("/poll-options/poll/{id}", getPollOptionsByPollId).Methods("GET")
	router.HandleFunc("/poll-options", createPollOption).Methods("POST")
	router.HandleFunc("/poll-options/{id}", updatePollOption).Methods("PUT")
	router.HandleFunc("/poll-options/{id}", deletePollOption).Methods("DELETE")

	router.HandleFunc("/votes", getPollOptionVotes).Methods("GET")
	router.HandleFunc("/votes/{poll-option-id}/{user-id}", getPollOptionVote).Methods("GET")
	router.HandleFunc("/votes", createPollOptionVote).Methods("POST")
	router.HandleFunc("/votes/{poll-option-id}/{user-id}", updatePollOptionVote).Methods("PUT")
	router.HandleFunc("/votes/{poll-option-id}/{user-id}", deletePollOptionVote).Methods("DELETE")

	router.HandleFunc("/likes", getLikes).Methods("GET")
	router.HandleFunc("/likes/{post-id}/{user-id}", getLike).Methods("GET")
	router.HandleFunc("/likes", createLike).Methods("POST")
	router.HandleFunc("/likes/{post-id}/{user-id}", updateLike).Methods("PUT")
	router.HandleFunc("/likes/{post-id}/{user-id}", deleteLike).Methods("DELETE")

	router.HandleFunc("/comments", getComments).Methods("GET")
	router.HandleFunc("/comments/{post-id}/{user-id}", getComment).Methods("GET")
	router.HandleFunc("/comments", createComment).Methods("POST")
	router.HandleFunc("/comments/{post-id}/{user-id}", updateComment).Methods("PUT")
	router.HandleFunc("/comments/{post-id}/{user-id}", deleteComment).Methods("DELETE")

	router.HandleFunc("/favorites", getFavorites).Methods("GET")
	router.HandleFunc("/favorites/{post-id}/{user-id}", getFavorite).Methods("GET")
	router.HandleFunc("/favorites", createFavorite).Methods("POST")
	router.HandleFunc("/favorites/{post-id}/{user-id}", updateFavorite).Methods("PUT")
	router.HandleFunc("/favorites/{post-id}/{user-id}", deleteFavorite).Methods("DELETE")

	router.HandleFunc("/follows", getFollows).Methods("GET")
	router.HandleFunc("/follows/{followed-id}/{follower-id}", getFollow).Methods("GET")
	router.HandleFunc("/follows", createFollow).Methods("POST")
	router.HandleFunc("/follows/{followed-id}/{follower-id}", updateFollow).Methods("PUT")
	router.HandleFunc("/follows/{followed-id}/{follower-id}", deleteFollow).Methods("DELETE")

	router.HandleFunc("/activity", getActivities).Methods("GET")
	router.HandleFunc("/activity/{id}", getActivity).Methods("GET")
	router.HandleFunc("/activity/user/{id}", getActivitiesByUserId).Methods("GET")
	router.HandleFunc("/activity", createActivity).Methods("POST")
	router.HandleFunc("/activity/{id}", updateActivity).Methods("PUT")
	router.HandleFunc("/activity/{id}", deleteActivity).Methods("DELETE")

	return router
}
