// Business lgic
import { Event } from "./models/event";
import { Repository } from "./repository";

export class Manager {

    private repository: Repository;

    constructor(){
        this.repository = new Repository();
    }

    // initialize = async (): Promise<void> => {
    //     // await this.repository.connect();
    // }


    readEvent = async (eventId: string): Promise<Event> => {
        const event = await this.repository.readEvent(eventId);
        if (event){
            delete event._id;
        }
        return event
    }

    readAllEvents = async(): Promise<Event[]> => {
        const events = await this.repository.readAllEvents();
        return events;
    }

    createEvent = async (event: Event): Promise<number> => {
        return await this.repository.createEvent(event);
    }
}