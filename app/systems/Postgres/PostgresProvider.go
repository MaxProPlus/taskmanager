package Postgres

import (
	"database/sql"
	_ "github.com/lib/pq"
)

type PostgresProvider struct{}

func (p *PostgresProvider) Connect() *sql.DB  {
	connStr := "user=postgres password=123 dbname=taskmanager sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	return db
}
