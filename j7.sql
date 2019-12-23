-- Создание базы данных
-- CREATE DATABASE taskmanager
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     CONNECTION LIMIT = -1;

-- Удалить предыдущие таблицы и последовательности
DROP TABLE IF EXISTS t_user;
DROP SEQUENCE IF EXISTS s_user;
DROP TABLE IF EXISTS t_task;
DROP SEQUENCE IF EXISTS s_task;
DROP TABLE IF EXISTS t_ref_task_type;
DROP SEQUENCE IF EXISTS s_ref_type_task;
DROP TABLE IF EXISTS t_project;
DROP SEQUENCE IF EXISTS s_project;
DROP TABLE IF EXISTS tok_employee_group;
DROP SEQUENCE IF EXISTS s_employee_group;
DROP TABLE IF EXISTS t_group;
DROP SEQUENCE IF EXISTS s_group;
DROP TABLE IF EXISTS t_employee;
DROP SEQUENCE IF EXISTS s_employee;
DROP TABLE IF EXISTS t_ref_position;
DROP SEQUENCE IF EXISTS s_position;

-- Таблица под должности
CREATE TABLE t_ref_position (
	c_id INTEGER PRIMARY KEY,
	c_name VARCHAR(30) NOT NULL
);
CREATE SEQUENCE s_position AS INTEGER INCREMENT 1 START 1;
ALTER TABLE t_ref_position ALTER COLUMN c_id SET DEFAULT nextval('s_position');

--ALTER SEQUENCE s_position OWNED BY t_ref_position.c_id;

-- Добавить начальные должности
INSERT INTO t_ref_position (c_name) VALUES ('Тимлид'),('программист');

-- Таблица под сотрудиков
CREATE TABLE t_employee (
	c_id INTEGER PRIMARY KEY,
	c_firstname VARCHAR(30) NOT NULL,
	c_secondname VARCHAR(30) NOT NULL,
	c_middlename VARCHAR(30) NOT NULL,
	fk_position INTEGER REFERENCES t_ref_position(c_id) NOT NULL
);
CREATE SEQUENCE s_employee AS INTEGER INCREMENT 1 START 1;
ALTER TABLE t_employee ALTER COLUMN c_id SET DEFAULT nextval('s_employee');

-- Таблица под пользователей
CREATE TABLE t_user (
	c_id INTEGER PRIMARY KEY,
	c_login VARCHAR(30) NOT NULL,
	c_password VARCHAR(32) NOT NULL,
	c_token VARCHAR(32),
	fk_employee INTEGER REFERENCES t_employee(c_id) NOT NULL
);
CREATE SEQUENCE s_user AS INTEGER INCREMENT 1 START 1;
ALTER TABLE t_user ALTER COLUMN c_id SET DEFAULT nextval('s_user');

-- Таблица под группы
CREATE TABLE t_group (
	c_id INTEGER PRIMARY KEY,
	c_name VARCHAR(30) NOT NULL,
	fk_leader INTEGER REFERENCES t_employee(c_id) ON DELETE SET NULL
);
CREATE SEQUENCE s_group AS INTEGER INCREMENT 1 START 1;
ALTER TABLE t_group ALTER COLUMN c_id SET DEFAULT nextval('s_group');

-- Таблица связей сотрудников с группами
CREATE TABLE tok_employee_group (
	c_id INTEGER PRIMARY KEY,
	fk_employee INTEGER REFERENCES t_employee(c_id) NOT NULL,
	fk_group INTEGER REFERENCES t_group(c_id) NOT NULL
);
CREATE SEQUENCE s_employee_group AS INTEGER INCREMENT 1 START 1;
ALTER TABLE tok_employee_group ALTER COLUMN c_id SET DEFAULT nextval('s_employee_group');

-- Таблица под проекты
CREATE TABLE t_project (
	c_id INTEGER PRIMARY KEY,
	c_name VARCHAR(100) NOT NULL,
	c_description TEXT NOT NULL,
	fk_group INTEGER REFERENCES t_group(c_id) ON DELETE SET NULL
);
CREATE SEQUENCE s_project AS INTEGER INCREMENT 1 START 1;
ALTER TABLE t_project ALTER COLUMN c_id SET DEFAULT nextval('s_project');

-- Таблица под типы задач
CREATE TABLE t_ref_task_type (
	c_id INTEGER PRIMARY KEY,
	c_name VARCHAR(30) NOT NULL
);
CREATE SEQUENCE s_ref_type_task AS INTEGER INCREMENT 1 START 1;
ALTER TABLE t_ref_task_type ALTER COLUMN c_id SET DEFAULT nextval('s_ref_type_task');

-- Добавить начальные типы задач
INSERT INTO t_ref_task_type (c_name) VALUES ('фича'),('фикс'),('баг'),('тест');

-- Таблица под задачи
CREATE TABLE t_task (
	c_id INTEGER PRIMARY KEY,
	c_name VARCHAR(30) NOT NULL,
	c_description TEXT NOT NULL,
	c_status SMALLINT NOT NULL,-- 1-создана,2-назначена,3-в работе,4-выполнена
	c_hours SMALLINT NOT NULL,
	fk_type INTEGER REFERENCES t_ref_task_type(c_id) NOT NULL,
	fk_project INTEGER REFERENCES t_project(c_id) ON DELETE CASCADE,
	fk_perfomer INTEGER REFERENCES t_employee(c_id) ON DELETE SET NULL,
	fk_author INTEGER REFERENCES t_employee(c_id) ON DELETE SET NULL,
	fk_parent INTEGER REFERENCES t_task(c_id) ON DELETE CASCADE
);
CREATE SEQUENCE s_task AS INTEGER INCREMENT 1 START 1;
ALTER TABLE t_task ALTER COLUMN c_id SET DEFAULT nextval('s_task');
