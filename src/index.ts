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

// This will probably be removed with a /search api
app.get("/event",
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
    "/event/:id",
    [
        // any validation goes here
    ],
    async (request: ExpressRequest, response: ExpressResponse<Response>) => {
        try {
            const event = await manager.readEvent(request.params.id);
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
    "/event",
    [
        body('minAge').exists().isInt().withMessage("minAge must be a whole number"),
        body('maxGuests').exists().isInt().withMessage("maxGuests must be a whole number"),
        body('imageUrl').exists().isURL().withMessage("imageUrl must be a valid url"),
        body('cost').exists().withMessage('cost must be defined'),
        body('cost').isNumeric().withMessage("cost must be a number"),
        body('description').exists().withMessage("descripton must be defined"),
        body('artist').exists().withMessage("artist must be defined"),
        body('scene').exists().withMessage("scene must be defined"),
        body('location').exists().withMessage("location must be defined"),
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

app.listen( port, () => {
    manager = new Manager();
    console.log( `server started at http://localhost:${ port }` );
});



