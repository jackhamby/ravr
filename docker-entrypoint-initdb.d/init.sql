create table events (
    event_id int generated always as identity,
    name text not null,
    min_age int not null,
    max_guests int not null,
    image_url text,
    description text not null,
    scene text not null,
    cost decimal not null,
    user_id int not null,

    primary key (eventId),
    constraint fk_user
        foreign key (user_id)
            references user(user_id) 
);


create table user {
    user_id int generated always as identity,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone text not null,

    primary key (userId)
}


c