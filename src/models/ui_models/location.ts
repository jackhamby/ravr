import { Contact } from "./contact";

export interface Location {
    location_id: number;
    latitude: number;
    longitude: number;
    line1: string;
    line2: string;
    zip: string;
    city: string;
    contact: Contact;
}