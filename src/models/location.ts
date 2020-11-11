import { Contact } from "./contact";
import { Address } from "./address";

export interface Location {
    name: string;
    address: Address;
    contact: Contact;
    latitude: number;
    longitude: number;
}