import { Location } from "./location";

export interface Event {
    _id: string;
    image: string;
    title: string;
    description: string;
    artists: string;
    date: Date;
    scene: string;
    minAge: number;
    maxGuests: number;
    promoter: string;
    cost: number;
    location: Location;
}
