create table map (
 id integer(11) auto_increment not null,
 title varchar(255),
 x integer (11),
 y integer (11),
 max_players INTEGER (11),
 game_type enum('dm', 'tdm', 'ctf'),
 rating INTEGER (11) default 0,
 primary key (id));

 create table zone (
id integer(11) auto_increment not null,
type varchar(255),
x integer (11),
y integer (11),
width integer (11),
height integer (11),
map integer (11),
primary key(id),
FOREIGN KEY (map) REFERENCES map(id)
);

alter table map add COLUMN map_hash VARCHAR (255);

create table tile (
id integer(11) auto_increment not null,
title varchar(255),
width integer (11),
height integer (11),
image VARCHAR (255),
primary key(id)
);

alter table zone add COLUMN tile INTEGER (11);