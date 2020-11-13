
create table users (
    user_id int generated always as identity,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone text not null,

    primary key (user_id)
);

create table contacts (
    contact_id int generated always as identity,
    first_name text not null,
    last_name text,
    email text,
    phone text,
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
    min_age int not null,
    max_guests int not null,
    image_url text,
    description text not null,
    scene text not null,
    cost decimal not null,
    user_id int not null,

    primary key (event_id),
    constraint creator
        foreign key (user_id)
            references users (user_id) 
);
    -- // into events(name, minAge, maxGuests, description, scene, cost)
        --  values('jacks cool event', 12, 200, 'a super cool event', 'indie/rock', 5.123);


-- insert into users (
--     first_name,
--     last_name,
--     email, 
--     phone
-- ) values (
--     'jack',
--     'hamby',
--     'jrhamby88@yahoo.com',
--     '6302406317'
-- ) returning user_id into test_user_id;

