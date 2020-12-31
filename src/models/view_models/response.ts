import { Error } from './error';

export interface Response extends Express.Response{
    results: any;
    errors: Error[];
}

