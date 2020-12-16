// Business lgic
import { Event } from "./models/event";
import { User } from "./models/user";
import { Repository } from "./repository";

export class Manager {

    private repository: Repository;

    constructor(){
        this.repository = new Repository();
    }
    
    readEvent = async (eventId: string): Promise<Event> => {
        // TODO: validation around eventId
        const event = await this.repository.readEvent(eventId);
        return event
    }

    readAllEvents = async(): Promise<Event[]> => {
        const events = await this.repository.readAllEvents();
        return events;
    }

    createEvent = async (event: Event): Promise<number> => {
        return await this.repository.createEvent(event);
    }

    readAllUsers = async (): Promise<User[]> => {
        return await this.repository.readAllUsers();
    }

    _initializeTestData =  async (): Promise<void> => {
        return this.repository._initializeTestData();
    }
}