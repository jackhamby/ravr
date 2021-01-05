import express, { Response as ExpressResponse, Request as ExpressRequest, response } from "express";
import { DataAccess } from "./data_access";
import { Response } from "./models/view_models/response";
import { body, validationResult, ValidationError, param } from'express-validator';
import * as BodyParser from 'body-parser';
import { CreateUser } from "./models/view_models/create_user";

const app = express();
const port = 8080;
let dataAccess: DataAccess = null;

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

app.get(
    "/",
    [],
    async(request: ExpressRequest, response: ExpressResponse<Response>) => {
        return response.status(200).send({
            results: null,
            errors: []
        });
    }
);

app.post(
    "/CreateEvent",
    [],
    async(request: ExpressRequest, response: ExpressResponse<Response>) => {
        const eventId = await dataAccess.createEvent(request.body)
        return response.status(201).send({
            results: eventId,
            errors: [],
        });
    }
)

app.get(
    "/EventList",
    [],
    async(request: ExpressRequest, response: ExpressResponse<Response>) => {
        const eventSummaries = await dataAccess.getEventList();
        return response.status(200).send({
            results: eventSummaries,
            errors: []
        });
    }
);

app.get(
    "/EventDetail/:event_id",
    [],
    async(request: ExpressRequest, response: ExpressResponse<Response>) => {
        const eventId = parseInt(request.params.event_id, 10);
        const eventDetail = await dataAccess.getEventDetail(eventId);
        return response.status(200).send({
            results: eventDetail,
            errors: []
        })

    });

app.post(
    "/CreateUser",
    [],
    async(request: ExpressRequest, response: ExpressResponse<Response>) => {
        const userId = await dataAccess.createUser(request.body)
        return response.status(201).send({
            results: userId,
            errors: []
        });

    }
);

app.post(
    "/SignIn",
    [],
    async(request: ExpressRequest, response: ExpressResponse<Response>) => {
        const result = await dataAccess.signIn(request.body.email, request.body.password);
        return response.status(200).send({
            results: result,
            errors: []
        });
    }
)



// app.post(
//     "/events",
//     [
//         body('name').isString().withMessage("name must be a string"),
//         body('min_age').isInt().withMessage("min_age must be a whole number"),
//         body('max_guests').isInt().withMessage("max_guests must be a whole number"),
//         body('cost').isNumeric().withMessage("cost must be a number"),
//         body('description').isString().withMessage("description must be a string"),
//         body('artists').isString().withMessage("artists must be string"),
//         body('scene').isString().withMessage("scene must be a string"),
//         body('image_url').isURL().withMessage("image_url must be a valid url"),
//         body('user_id').isInt().withMessage("user_id must be an int"),
//         body('location_id').isInt().withMessage("location_id must be an int")
//     ],
//     async (request: ExpressRequest, response: ExpressResponse<Response>) => {
//         const errors = validationResult(request);
//         // 400
//         if (!errors.isEmpty()){
//             return response.status(400).send({
//                 results: null,
//                 errors: errors.array().map((error: ValidationError) => {
//                     return {
//                         message: error.msg,
//                     }
//                 }),
//             });
//         }
//         try{
//             // 201
//             const eventId = await manager.createEvent(request.body);
//             if (eventId){
//                 return response.status(201).send({
//                     results: eventId,
//                     errors: [],
//                 })
//             }
//             // 500
//             return response.status(500).send({
//                 results: null,
//                 errors: [{
//                     message: "there was an error creating event"
//                 }]
//             })
//         }
//         catch(exception){
//             // 500
//             return response.status(500).send({
//                 results: null,
//                 errors: [{
//                     message: "there was an error creating event"
//                 }]
//             })
//         }
//     }
// );

app.listen( port, async () => {
    dataAccess = new DataAccess();

    // TODO: remove test data
    await dataAccess._initializeTestData();
    console.log( `server started at http://localhost:${ port }` );
});



