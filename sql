create table categories
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null
);

create table location
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null
);

create table items
(
    id          int auto_increment
        primary key,
    category_id int                      not null,
    location_id int                      not null,
    name        varchar(255)             not null,
    description text                     null,
    image       varchar(255)             null,
    created_at  datetime default (now()) null,
    constraint items_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint items_location_id_fk
        foreign key (location_id) references location (id)
);

