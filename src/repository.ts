import { MongoClient, Db, ObjectId} from 'mongodb';
import { Event } from './models/event';
import { Pool, Client } from 'pg';


export class Repository {

    private pool: Pool;
    private databaseHost: string;
    private databaseUser: string;
    private databaseName: string;
    private databasePassword: string;
    private databasePort: number;

    constructor() {

        
        // this.databasePassword = null;
        // this.databasePort = 5432;
        this.pool = new Pool();
        // this.pool = new Pool({
        //     connectionString: this.databaseHost
        //     // user: this.databaseUser,
        //     // host: this.databaseHost,
        //     // database: this.databaseName,
        //     // password: this.databasePassword,
        //     // port: this.databasePort,
        // })
    }

    // connect = async(): Promise<any> => {
    //     try {
    //         // this.client = await MongoClient.connect(this.databaseUrl);k
    //         // await this.pool.connect()
    //     }
    //     catch(e){
    //         throw new Error(('Failed to connect to database server'));
    //     }
    // }

    createEvent = async(event: Event): Promise<number> => {
    // insert
    // into events(name, minAge, maxGuests, description, scene, cost)
    // values('jacks cool event', 12, 200, 'a super cool event', 'indie/rock', 5.123);



        return null;
    }

    readEvent = async(eventId: string): Promise<Event> => {
    //     const database: Db = this.client.db(this.databaseName);
    //     try{
    //         const event = await database.collection(this.eventCollectionName).findOne<Event>({ _id: new ObjectId(eventId)});
    //         return event;
    //     }
    //     catch {
            return null;
    //     }
    }

    readAllEvents = async(): Promise<Event[]> => {
        const result = await this.pool.query<Event>("select * from events;");
        return result.rows;
    }

    disconnect = (): void => {
    //   this.client.close();
    }
}