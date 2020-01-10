package Postgres

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type PostgresProvider struct{}

//Создать подключение к бд и вернуть ссылку на нее
func (p *PostgresProvider) Connect() *sql.DB {
	user := "postgres"
	password := "123"
	dbname := "taskmanager"
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", user, password, dbname)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	return db
}
