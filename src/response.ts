import { Error } from './models/error';
import { Event } from './models/event';

export interface Response extends Express.Response{
    results: any;
    errors: Error[];
}

