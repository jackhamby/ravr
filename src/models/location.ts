import { Contact } from "./contact";
import { Address } from "./address";

export interface Location {
    contact: Contact;
    address: Address;
}