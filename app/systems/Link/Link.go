package Link

import (
	"database/sql"
	"taskmanager/app/models/entity"
)

type Link struct {
	DB   *sql.DB
	User *entity.User
}
