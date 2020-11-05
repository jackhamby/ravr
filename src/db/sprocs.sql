

insert 
    into events(name, minAge, maxGuests, description, scene, cost)
    values('jacks cool event', 12, 200, 'a super cool event', 'indie/rock', 5.123);




select * from events;


-- create table events (
--     eventId int generated always as identity,
--     name text NOT NULL,
--     minAge int NOT NULL,
--     maxGuests int NOT NULL,
--     imageUrl text,
--     description text NOT NULL,
--     scene text NOT NULL,
--     cost decimal NOT NULL,

--     primary key (eventId)
--     -- artist text,
--     -- location foreign key


-- );   