import { Event } from './models/event';
import { Pool, Client } from 'pg';
import { User } from './models/user';
import { Location } from './models/location';
import { Contact } from './models/contact';


export class Repository {

    private pool: Pool;

    constructor() {
        this.pool = new Pool();
    }

    createEvent = async(event: Event): Promise<number> => {
        const result = await this.pool.query<Event>(
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
                '${event.user_id}',
                '${event.location_id}'
            ) returning event_id;`
        );

        const eventId = result.rows[0].event_id;    
        return eventId;
    }

    readEvent = async(eventId: string): Promise<Event> => {
        const result = await this.pool.query<Event>(`select * from events where event_id = ${eventId};`)
        return result.rows[0];
    }

    readAllEvents = async(): Promise<Event[]> => {
        const result = await this.pool.query<Event>("select * from events;");
        return result.rows;
    }

    readAllUsers = async(): Promise<User[]> => {
        const result = await this.pool.query<User>("select * from users;");
        return result.rows;
    }










    // TODO: remove this test data
    createTestUser = async(): Promise<number> => {
        const fn = "jack";
        const ln = "hamby";
        const eml = "ppop@shit.com";
        const isActive = true;
        const result = await this.pool.query<User>(
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

        const result = await this.pool.query<Location>(
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
        const result = await this.pool.query<Contact>(
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

        const result = await this.pool.query<Event>(
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