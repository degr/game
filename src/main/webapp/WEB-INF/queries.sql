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
alter table zone add COLUMN title varchar (255);
alter table tile add COLUMN is_tileset bit(1);
alter table zone add COLUMN shiftx int(11);
alter table zone add COLUMN shifty int(11);

update map set game_type = 'dm' where game_type is NULL;
alter TABLE map modify COLUMN game_type enum('dm', 'tdm', 'ctf') not null DEFAULT 'dm';
alter TABLE zone add COLUMN angle FLOAT;

create table user (
id integer(11) auto_increment not null,
username varchar(255),
password VARCHAR (255),
authority VARCHAR (255),
primary key(id)
);
create table game_profile (
id integer(11) auto_increment not null,
username varchar(255),
user int(11),
arena bit(1),
primary key(id)
);
delete from user where id not in (select user from game_profile);

alter TABLE zone add COLUMN passable BIT;
alter TABLE zone add COLUMN shootable BIT;