import { Location } from "./location";
import { User } from "./user";

export interface Event {
    event_id: number;
    name: string;
    artists: string;
    min_age: number;
    max_guests: number;
    image_url: string;
    description: string;
    scene: string;
    cost: number;
    creator: User;
    location: Location;
}
