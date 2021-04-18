package models

import (
	"database/sql"
	"time"
)

type User struct {
	ID          int64          `json:"id"`
	Username    string         `json:"username"`
	Email       string         `json:"email"`
	Password    string         `json:"password"`
	Dob         string         `json:"dob"`
	Country     string         `json:"country"`
	Description string         `json:"description"`
	DarkMode    bool           `json:"darkmode"`
	JoinedOn    time.Time      `json:"joinedon"`
	PfpUrl      sql.NullString `json:"pfpurl"`
}

type Post struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"userid"`
	CreatedOn time.Time `json:"createdon"`
	Category  string    `json:"category"`
}

type Video struct {
	ID           int64          `json:"id"`
	PostID       int64          `json:"postid"`
	Title        string         `json:"title"`
	Description  string         `json:"description"`
	Views        int            `json:"views"`
	Private      bool           `json:"private"`
	FileUrl      sql.NullString `json:"file"`
	ThumbnailUrl sql.NullString `json:"thumbnail"`
}

type Photo struct {
	ID          int64
	PostID      int64          `json:"postid"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Views       int            `json:"views"`
	Private     bool           `json:"private"`
	FileUrl     sql.NullString `json:"file"`
}

type Statement struct {
	ID      int64
	PostID  int64  `json:"postid"`
	Content string `json:"content"`
	Views   int    `json:"views"`
}

type Poll struct {
	ID          int64
	PostID      int64  `json:"postid"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type PollOption struct {
	ID     int64
	PollID int64  `json:"pollid"`
	Label  string `json:"label"`
}

type PollOptionVote struct {
	PollOptionID int64 `json:"polloptionid"`
	UserID       int64 `json:"userid"`
}

type Like struct {
	PostID int64 `json:"postid"`
	UserID int64 `json:"userid"`
}

type Comment struct {
	PostID      int64     `json:"postid"`
	UserID      int64     `json:"userid"`
	Content     string    `json:"content"`
	CommentedOn time.Time `json:"commentedon"`
}

type Favorite struct {
	PostID int64 `json:"postid"`
	UserID int64 `json:"userid"`
}

type Follow struct {
	Followed int64 `json:"followed"`
	Follower int64 `json:"follower"`
}

type Activity struct {
	ID          int64
	UserID      int64  `json:"userid"`
	Description string `json:"description"`
	CreatedAt   time.Time
}
