drop database  musify_dev;
create database  musify_dev;

use musify_dev;

create table  role(
	id SERIAL PRIMARY KEY,
    description varchar(20) not null,
    createdDate timestamp default CURRENT_TIMESTAMP not null,
    modifyDate timestamp null,
    endDate timestamp null
);

insert into role (description) values ('ROLE_ADMIN'),('ROLE_USER');

create table  users(
	id SERIAL PRIMARY KEY,
	name varchar(50) not null,
    surname varchar(50) not null,
    email varchar(50) not null unique,
    role_id integer not null,
    image_path varchar(100) null,
    image_url varchar(100),
	password varchar(300) not null,
    foreign key (role_id) references role(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS artists (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
    image varchar(100) null,
    image_url VARCHAR(100) NULL
);

create table  albums (
	id SERIAL PRIMARY KEY,
    title varchar(50) not null,
    description varchar(50) not null,
    date_release timestamp,
    artist_id integer not null,
    image varchar(100) null,
    image_url varchar(100) null,
    foreign key (artist_id) references artists(id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table  songs(
	id SERIAL PRIMARY KEY,
	number INT not null,
    name VARCHAR(50),
    duration time,
    file varchar(100) null,
    file_url varchar(100),
    album_id integer not null,
    foreign key (album_id) references albums(id) ON DELETE CASCADE ON UPDATE CASCADE
);