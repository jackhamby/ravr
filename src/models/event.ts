import { Location } from "./location";

export interface Event {
    _id: string;
    title: string;
    minAge: number;
    maxGuests: number;
    imageUrl: string;
    description: string;
    artist: string[];
    scene: string;
    cost: number;
    location: Location;
}
