import express, { Response as ExpressResponse, Request as ExpressRequest, response } from "express";
import { Manager } from "./manager";
import { Response } from "./response";
import { Event } from './models/event';
import { body, validationResult, ValidationError, param } from'express-validator';
import * as BodyParser from 'body-parser';

const app = express();
const port = 8080;
let manager: Manager = null;

// mongo
// 127.0.0.1
// 27017
app.use((req, res, next) => {
    BodyParser.json()(req, res, (err) => {
        if (err) {
            res.status(400).send({
                results: null,
                errors: [
                    "json body required",
                ]
            });
            // TODO: log error
            return;
        }
        next();
    });
});



app.get("/users",
    [
    ],
    async (request: ExpressRequest, response: ExpressResponse<Response>) => {
        try{
            const users = await manager.readAllUsers();
            response.status(200).send({
                results: users,
                errors: []
            });
        }
        catch (exception){
            response.status(500).send({
                results: null,
                errors: [
                    {
                        message: "failed to read all users"
                    }
                ]
            })
        }
    });

// This will probably be removed with a /search api
app.get("/events",
        [

        ],
        async(request: ExpressRequest, response: ExpressResponse<Response>) => {

            try {
                const events = await manager.readAllEvents();
                response.status(200).send({
                    results: events,
                    errors: []
                })
            }
            catch {
                response.status(500).send({
                    results: null,
                    errors: [
                        {
                            message: "failed to read all events"
                        }
                    ]
                })
            }
        }
);


app.get(
    "/events/:event_id",
    [
        param('event_id').exists().isInt().withMessage("event id must be a whole number"),
    ],
    async (request: ExpressRequest, response: ExpressResponse<Response>) => {
        const errors = validationResult(request);
        // 400
        if (!errors.isEmpty()){
            return response.status(400).send({
                results: null,
                errors: errors.array().map((error: ValidationError) => {
                    return {
                        message: error.msg,
                    }
                }),
            });
        }
        try {
            const event = await manager.readEvent(request.params.event_id);
            if (event){
                return response.status(200).send({
                    results: event,
                    errors: [],
                })
            }
            return response.status(404).send({
                results: null,
                errors: [{
                    message: "event not found"
                }]
            })
        }
        catch (exception){
            return response.status(500).send({
                results: null,
                errors: [{
                    message: "internal server error"
                }]
            })
        }
    }
);




app.post(
    "/events",
    [
        body('name').isString().withMessage("name must be a string"),
        body('min_age').isInt().withMessage("min_age must be a whole number"),
        body('max_guests').isInt().withMessage("max_guests must be a whole number"),
        body('cost').isNumeric().withMessage("cost must be a number"),
        body('description').isString().withMessage("description must be a string"),
        body('artists').isString().withMessage("artists must be string"),
        body('scene').isString().withMessage("scene must be a string"),
        body('image_url').isURL().withMessage("image_url must be a valid url"),
        body('user_id').isInt().withMessage("user_id must be an int"),
        body('location_id').isInt().withMessage("location_id must be an int")
    ],
    async (request: ExpressRequest, response: ExpressResponse<Response>) => {
        const errors = validationResult(request);
        // 400
        if (!errors.isEmpty()){
            return response.status(400).send({
                results: null,
                errors: errors.array().map((error: ValidationError) => {
                    return {
                        message: error.msg,
                    }
                }),
            });
        }
        try{
            // 201
            const eventId = await manager.createEvent(request.body);
            if (eventId){
                return response.status(201).send({
                    results: eventId,
                    errors: [],
                })
            }
            // 500
            return response.status(500).send({
                results: null,
                errors: [{
                    message: "there was an error creating event"
                }]
            })
        }
        catch(exception){
            // 500
            return response.status(500).send({
                results: null,
                errors: [{
                    message: "there was an error creating event"
                }]
            })
        }
    }
);

app.listen( port, async () => {
    manager = new Manager();

    // TODO: remove test data
    await manager._initializeTestData();
    console.log( `server started at http://localhost:${ port }` );
});



