create database ravr;

create table events (
    eventId int generated always as identity,
    name text NOT NULL,
    minAge int NOT NULL,
    maxGuests int NOT NULL,
    imageUrl text,
    description text NOT NULL,
    scene text NOT NULL,
    cost decimal NOT NULL,

    primary key (eventId)
    -- artist text,
    -- location foreign key


);   

--  _id: string;
--     title: string;
--     minAge: number;
--     maxGuests: number;
--     imageUrl: string;
--     description: string;
--     artist: string[];
--     scene: string;
--     cost: number;
--     location: Location;