export interface CreateEvent {
    // Event
    title: string;
    image_url: string;
    min_age: number;
    max_guests: number;
    cost: number;
    scene: string;
    description: string;
    artists: string;
    promoter: string;
    user_id: number;


    // Location
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;

    // Contact
    first_name: string;
    last_name: string;
    email: string;
}
