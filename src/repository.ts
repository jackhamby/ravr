import { Event as DbEvent } from './models/db_models/event';
import { Pool, Client } from 'pg';
import { User as DbUser } from './models/db_models/user';
import { Location as DbLocation } from './models/db_models/location';
import { Contact as DbContact } from './models/db_models/contact';
import { Event } from './models/ui_models/event';
import { User } from './models/ui_models/user';
import { Location } from './models/ui_models/location';



export class Repository {

    private pool: Pool;

    constructor() {
        this.pool = new Pool();
    }

    createEvent = async(event: Event): Promise<number> => {
        const result = await this.pool.query<DbEvent>(
            `insert into events(
                name,
                artists,
                min_age,
                max_guests,
                image_url,
                description,
                scene,
                cost,
                user_id,
                location_id
            ) values (
                '${event.name}',
                '${event.artists}',
                '${event.min_age}',
                '${event.max_guests}',
                '${event.image_url}',
                '${event.description}',
                '${event.scene}',
                '${event.cost}',
                '${event.creator.user_id}',
                '${event.location.location_id}'
            ) returning event_id;`
        );

        const eventId = result.rows[0].event_id;    
        return eventId;
    }

    readEvent = async(eventId: string): Promise<Event> => {
        // const result = await this.pool.query<DbEvent & DbUser & DbLocation>(`select 
        //                                                     ev.event_id,
        //                                                     ev.description,
        //                                                     cont.first_name contact
        //                                                 from events as ev
        //                                                 full outer join users as us
        //                                                     on ev.user_id = us.user_id
        //                                                 full outer join locations as loc
        //                                                     on ev.location_id = loc.location_id 
        //                                                     full outer join contacts as cont
        //                                                         on cont.contact_id = loc.contact_id
        //                                                 and ev.event_id = ${eventId};`);
        const result = await this.pool.query<any>(`select 
                                                            ev.event_id,
                                                            ev.description,
                                                            ev.artists,
                                                            ev.cost,
                                                            ev.image_url,
                                                            ev.max_guests,
                                                            ev.min_age,
                                                            ev.name,
                                                            event.scene,
                                                            cont.first_name bigpoop
                                                        from events as ev
                                                        full outer join users as us
                                                            on ev.user_id = us.user_id
                                                        full outer join locations as loc
                                                            on ev.location_id = loc.location_id 
                                                            full outer join contacts as cont
                                                                on cont.contact_id = loc.contact_id
                                                        and ev.event_id = ${eventId};`);
        const dbEvent = result.rows[0];
        console.log(dbEvent);
        const event = {} as Event;
        event.artists = dbEvent.artists;
        event.cost = dbEvent.cost;
        event.description = dbEvent.description;
        event.event_id = dbEvent.event_id;
        event.image_url = dbEvent.image_url;
        event.max_guests = dbEvent.max_guests;
        event.min_age = dbEvent.min_age;
        event.name = dbEvent.name;
        event.scene = dbEvent.scene;

        event.location = {} as Location;
        event.location.city = dbEvent.city;
        event.location.latitude = dbEvent.latitude;
        event.location.longitude = dbEvent.longitude;
        event.location.line1 = dbEvent.line1;
        event.location.line2 = dbEvent.line2;
        event.location.zip = dbEvent.zip;
        event.location.contact = null; // TODO: how to query this without overrriding event.creator data

        event.creator = {} as User;
        event.creator.email = dbEvent.email;
        event.creator.name = dbEvent.name;
        event.creator.phone = dbEvent.phone;
        event.creator.is_active = dbEvent.is_active;
        event.creator.user_id = dbEvent.user_id;
        
        // return result.rows[0];
        return event;
    }

    readAllEvents = async(): Promise<Event[]> => {
        const result = await this.pool.query<DbEvent>("select * from events;");
        // return result.rows;
        return [] as Event[];
    }

    readAllUsers = async(): Promise<User[]> => {
        const result = await this.pool.query<DbUser>("select * from users;");
        // return result.rows;
        return [] as User[];
    }










    // TODO: remove this test data
    createTestUser = async(): Promise<number> => {
        const fn = "jack";
        const ln = "hamby";
        const eml = "ppop@shit.com";
        const isActive = true;
        const result = await this.pool.query<DbUser>(
            `insert into users(
                is_active,
                first_name,
                last_name,
                email
            ) values (
                '${isActive}',
                '${fn}',
                '${ln}',
                '${eml}'
            ) returning user_id;`
        );
        console.log(result)
        const userId = result.rows[0].user_id;
        console.log(`created user ${userId}`);
        return userId;
    }

    createTestLocation = async(userId: number, contactId: number): Promise<number> => {
        const lt = 50;
        const lg = 50;
        const ln1 = "1500 lasalle";
        const ln2 = "Apt 304";
        const zp = "55403";
        const cty = "Minneapolis";
        const ste = "Minnesota";

        const result = await this.pool.query<DbLocation>(
            `insert into locations(
                latitude,
                longitude,
                line1,
                line2,
                zip,
                city,
                state,
                contact_id,
                user_id
            ) values (
                '${lt}',
                '${lg}',
                '${ln1}',
                '${ln2}',
                '${zp}',
                '${cty}',
                '${ste}',
                '${contactId}',
                '${userId}'
            ) returning location_id;`
        );

        const locationId = result.rows[0].location_id;
        console.log(result)
        console.log(`created location ${locationId}`);
        return locationId;
    }


    createTestContact = async(userId: number): Promise<number> => {
        const fn = "nappy";
        const ln = "sama";
        const eml = "nappy@gmail.com";
        const uId = userId;
        const result = await this.pool.query<DbContact>(
            `insert into contacts(
                first_name,
                last_name,
                email,
                user_id
            ) values (
                '${fn}',
                '${ln}',
                '${eml}',
                '${uId}'
            ) returning contact_id;`
        );

        const contactId = result.rows[0].contact_id;
        console.log(`created contact ${contactId}`)
        return contactId;
    }

    createTestEvent = async(userId: number, locationId: number): Promise<number> => {
        const name = "my fun event";
        const artists = "nickelback";
        const minAge = 18;
        const maxGuests = 200;
        const imageUrl = "https://imgur.com/r/nature/dpQzWkM";
        const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget metus ante. Quisque malesuada ligula ac turpis semper volutpat. Etiam porttitor eget turpis eu molestie. Donec sit amet nunc at velit suscipit efficitur in eu diam. Maecenas mattis augue iaculis massa pharetra viverra. Aliquam eu urna vitae dui cursus euismod pulvinar sit amet risus. In vitae enim quam. Nunc auctor nibh non sagittis ullamcorper. Phasellus rutrum cursus malesuada. Suspendisse elementum ultricies urna, quis pharetra odio. Suspendisse accumsan, arcu eu congue vulputate, leo mi molestie sapien, in commodo leo ante vitae dui. Sed sagittis malesuada ante. Aliquam id lectus non lacus ultrices maximus eu ac risus. ";
        const scene = "techno";
        const cost = 25.0;

        const result = await this.pool.query<DbEvent>(
            `insert into events(
                name,
                artists,
                min_age,
                max_guests,
                image_url,
                description,
                scene,
                cost,
                user_id,
                location_id
            ) values (
                '${name}',
                '${artists}',
                '${minAge}',
                '${maxGuests}',
                '${imageUrl}',
                '${description}',
                '${scene}',
                '${cost}',
                '${userId}',
                '${locationId}'
            ) returning event_id;`
        );

        const eventId = result.rows[0].event_id;
        console.log(`created event ${eventId}`)
        return eventId;
    }

    _initializeTestData = async(): Promise<void> => {
        // init things here
        const userId = await this.createTestUser();
        console.log(userId)
        const contactId = await this.createTestContact(userId);
        const locationId = await this.createTestLocation(userId, contactId);
        const eventId = await this.createTestEvent(userId, locationId);
    }
}