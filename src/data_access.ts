import { Event as DbEvent } from './models/db_models/event';
import { Pool, Client } from 'pg';
import { User as DbUser } from './models/db_models/user';
import { EventSummary } from './models/view_models/event_list';
import { EventDetail } from './models/view_models/event_detail';
import { CreateUser } from './models/view_models/create_user';
import { randomBytes, createHash } from 'crypto';
import { CreateUserResponse } from './models/view_models/create_user_response';
import { VerifyPassword } from './models/view_models/verify_password';
import { CreateEvent } from './models/view_models/create_event';
import { CreateContact } from './models/view_models/create_contact';
import { CreateLocation } from './models/view_models/create_location';
import { CreateContactResponse } from './models/view_models/create_contact_response';
import { CreateLocationResponse } from './models/view_models/create_location_response';


export class DataAccess {

    private pool: Pool;

    constructor() {
        this.pool = new Pool();
    }

    getEventList = async(): Promise<EventSummary[]> => {
        const result = await this.pool.query<EventSummary>(`select 
                                                                event_id,
                                                                image_url
                                                            from events;`);
        return result.rows;
    }

    getEventDetail = async(eventId: number): Promise<EventDetail> => {
        const result = await this.pool.query<EventDetail>(`select
            event_id,
            title,
            image_url,
            line1,
            line2,
            city,
            state,
            zip,
            min_age,
            max_guests,
            scene,
            description,
            artists,
            promoter
        from events
        full outer join locations
            on events.location_id = locations.location_id
        and events.event_id = ${eventId};`)
        return result.rows[0];
    }

    createEvent = async(event: CreateEvent): Promise<number> => {
        const contact = {} as CreateContact;
        contact.email = event.email;
        contact.first_name = event.first_name;
        contact.last_name = event.last_name;
        contact.user_id = event.user_id;
        
        const contactId = await this.createContact(contact);

        const location = {} as CreateLocation;
        location.city = event.city;
        location.state = event.state;
        location.zip = event.zip;
        location.line1 = event.line1;
        location.line2 = event.line2;
        location.latitude = event.latitude;
        location.longitude = event.longitude;
        location.user_id = event.user_id;
        location.contact_id = contactId;
        
        const locationId = await this.createLocation(location);

        const eventValues = [
            event.title,
            event.artists,
            event.min_age,
            event.max_guests,
            event.image_url,
            event.description,
            event.scene,
            event.cost,
            event.user_id,
            locationId
        ];

        const eventQuery = `insert into events(
            title,
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
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
        ) returning event_id;`

        const result = await this.pool.query<DbEvent>(eventQuery, eventValues);
        const eventId = result.rows[0].event_id;    
        return eventId;
    }

    createUser = async(user: CreateUser): Promise<number> => {
        const salt = randomBytes(16).toString("base64");
        const saltedPassword = user.password + salt;
        const hash = createHash('sha256');
        hash.update(saltedPassword);
        const passwordHash = hash.digest("hex");
        const result = await this.pool.query<CreateUserResponse>(`insert into users (
            first_name,
            last_name,
            email,
            salt,
            password,
            is_active
        ) values (
            '${user.first_name}',
            '${user.first_name}',
            '${user.email}',
            '${salt}',
            '${passwordHash}',
            ${false}
        ) returning user_id; `);
        return result.rows[0].user_id;
    }

    createContact = async(contact: CreateContact): Promise<number> => {
        // TODO: do we need objects defined for the result
        // of insert statements
        const contactResult = await this.pool.query<CreateContactResponse>(
            `insert into contacts(
                first_name,
                last_name,
                email,
                user_id
            ) values (
                '${contact.first_name}',
                '${contact.last_name}',
                '${contact.email}',
                '${contact.user_id}'
            ) returning contact_id;`
        );

        const contactId = contactResult.rows[0].contact_id;
        return contactId;
    }

    createLocation = async(location: CreateLocation): Promise<number> => {
        const locationValues = [
            location.latitude,
            location.longitude,
            location.line1,
            location.line2,
            location.zip,
            location.city,
            location.state,
            location.contact_id,
            location.user_id
        ];

        const locationQuery = `insert into locations(
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
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9
        ) returning location_id;`;

        const locationResult = await this.pool.query<CreateLocationResponse>(locationQuery, locationValues);
        const locationId = locationResult.rows[0].location_id;
        return locationId;
    }


    signIn = async(email: string, password: string): Promise<number> => {
        const result = await this.pool.query<VerifyPassword>(`select 
                                                      user_id,
                                                      password,
                                                      salt
                                                   from users where email = '${email}';`);

        if (!(result.rowCount > 0)){
            // TODO: handle error
            return 0;

        }
        const passwordHash = result.rows[0].password;
        const salt = result.rows[0].salt;
        const user_id = result.rows[0].user_id;

        const hash = createHash('sha256');
        const saltedPassword = password + salt;
        hash.update(saltedPassword);
        const newPasswordHash = hash.digest("hex");
        if (newPasswordHash === passwordHash){
            return user_id;
        }
        // TODO: handle error
        return 0; 
    }





    // TODO: remove this test data
    createTestUser = async(): Promise<number> => {
        const fn = "jack";
        const ln = "hamby";
        const eml = "ppop@shit.com";
        const password = "somepassword";
        const salt = "salt"

        const isActive = true;
        const result = await this.pool.query<CreateUserResponse>(
            `insert into users(
                is_active,
                first_name,
                last_name,
                email,
                password,
                salt
            ) values (
                '${isActive}',
                '${fn}',
                '${ln}',
                '${eml}',
                '${password}',
                '${salt}'
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

        const result = await this.pool.query<CreateLocationResponse>(
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
                ${lt === undefined ? 'NULL' : lt},
                ${lg === undefined ? 'NULL' : lg},
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
        const result = await this.pool.query<CreateContactResponse>(
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
        const title = "my fun event";
        const artists = "nickelback";
        const minAge = 18;
        const maxGuests = 200;
        const imageUrl = "https://imgur.com/r/nature/dpQzWkM";
        const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget metus ante. Quisque malesuada ligula ac turpis semper volutpat. Etiam porttitor eget turpis eu molestie. Donec sit amet nunc at velit suscipit efficitur in eu diam. Maecenas mattis augue iaculis massa pharetra viverra. Aliquam eu urna vitae dui cursus euismod pulvinar sit amet risus. In vitae enim quam. Nunc auctor nibh non sagittis ullamcorper. Phasellus rutrum cursus malesuada. Suspendisse elementum ultricies urna, quis pharetra odio. Suspendisse accumsan, arcu eu congue vulputate, leo mi molestie sapien, in commodo leo ante vitae dui. Sed sagittis malesuada ante. Aliquam id lectus non lacus ultrices maximus eu ac risus. ";
        const scene = "techno";
        const cost = 25.0;
        const promoter = "Jones Co. Gigs and Guitars";

        const result = await this.pool.query<DbEvent>(
            `insert into events(
                title,
                artists,
                min_age,
                max_guests,
                image_url,
                description,
                scene,
                cost,
                promoter,
                user_id,
                location_id
            ) values (
                '${title}',
                '${artists}',
                '${minAge}',
                '${maxGuests}',
                '${imageUrl}',
                '${description}',
                '${scene}',
                '${cost}',
                '${promoter}',
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