import { MongoClient, Db, ObjectId} from 'mongodb';
import { Event } from './models/event';
import { Pool, Client } from 'pg';
import { User } from './models/user';


export class Repository {

    private pool: Pool;

    constructor() {
        this.pool = new Pool();
    }

    createEvent = async(event: Event): Promise<number> => {
        return null;
    }

    readEvent = async(eventId: string): Promise<Event> => {
        const result = await this.pool.query<Event>("select * from event where event_id")
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
    createUser = async(): Promise<number> => {
        const fn = "jack";
        const ln = "hamby";
        const eml = "ppop@shit.com";
        const pne = "6023333412";
        const result = await this.pool.query<User>(
            `insert into users(
                first_name,
                last_name,
                email,
                phone
            ) values (
                '${fn}',
                '${ln}',
                '${eml}',
                '${pne}'
            ) returning user_id;`
        );
        console.log(result)
        const userId = result.rows[0].id;
        console.log(`created user ${userId}`);
        return userId;
    }

    createLocation = async(userId: number, contactId: number): Promise<number> => {
        const lt = 50;
        const lg = 50;
        const ln1 = "1500 lasalle";
        const ln2 = "Apt 304";
        const zp = "55403";
        const cty = "Minneapolis";
        const ste = "Minnesota";

        const result = await this.pool.query<User>(
            `insert into locations(
                latitude,
                longitude,
                line1,
                line2,
                zip,
                city,
                state,
                contact_id,
                user_id,
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

        const locationId = result.rows[0].id;
        console.log(result)
        console.log(`created location ${locationId}`);
        return locationId;
    }


    createContact = async(userId: number): Promise<number> => {
        const fn = "nappy";
        const ln = "sama";
        const eml = "nappy@gmail.com";
        const pne = "6305513321";
        const uId = userId;
        const result = await this.pool.query<User>(
            `insert into contacts(
                first_name,
                last_name,
                email,
                phone,
                user_id
            ) values (
                '${fn}',
                '${ln}',
                '${eml}',
                '${pne}',
                '${uId}',
            );`
        );

        const contactId = result.rows[0].id;
        console.log(`created contact ${contactId}`)
        return contactId;
    }

    _initializeTestData = async(): Promise<void> => {
        // init things here
        const userId = await this.createUser();
        console.log(userId)
        // const contactId = await this.createContact(userId);
        // const locationId = await this.createLocation(userId, contactId);
    }
}