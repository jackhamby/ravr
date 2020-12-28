import { Error } from './models/ui_models/error';

export interface Response extends Express.Response{
    results: any;
    errors: Error[];
}

