
create table users (
    user_id int generated always as identity,
    first_name text not null,
    last_name text not null,
    email text not null,
    is_active boolean not null,

    primary key (user_id)
);

create table contacts (
    contact_id int generated always as identity,
    first_name text not null,
    last_name text not null,
    email text,
    user_id int not null,

    primary key (contact_id),
    constraint creator
        foreign key (user_id)
            references users (user_id)
);

create table locations (
    location_id int generated always as identity,
    latitude int not null,
    longitude int not null,
    line1 text,
    line2 text,
    zip text not null,
    city text not null,
    state text not null,
    contact_id int not null,
    user_id int not null,

    primary key (location_id),
    constraint creator
        foreign key (user_id)
            references users (user_id),
    constraint contact
        foreign key (contact_id)
            references contacts (contact_id)
);

create table events (
    event_id int generated always as identity,
    name text not null,
    artists text not null,
    min_age int not null,
    max_guests int not null,
    image_url text,
    description text not null,
    scene text not null,
    cost decimal not null,
    user_id int not null,
    location_id int not null,

    primary key (event_id),
    constraint creator
        foreign key (user_id)
            references users (user_id),

    constraint location
        foreign key(location_id)
            references locations(location_id)
);
