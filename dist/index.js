"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manager_1 = require("./manager");
const express_validator_1 = require("express-validator");
const BodyParser = __importStar(require("body-parser"));
const app = express_1.default();
const port = 8080;
let manager = null;
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
app.get("/users", [], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield manager.readAllUsers();
        response.status(200).send({
            results: users,
            errors: []
        });
    }
    catch (exception) {
        response.status(500).send({
            results: null,
            errors: [
                {
                    message: "failed to read all users"
                }
            ]
        });
    }
}));
// This will probably be removed with a /search api
app.get("/event", [], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield manager.readAllEvents();
        response.status(200).send({
            results: events,
            errors: []
        });
    }
    catch (_a) {
        response.status(500).send({
            results: null,
            errors: [
                {
                    message: "failed to read all events"
                }
            ]
        });
    }
}));
app.get("/event/:id", [
// any validation goes here
], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield manager.readEvent(request.params.id);
        if (event) {
            return response.status(200).send({
                results: event,
                errors: [],
            });
        }
        return response.status(404).send({
            results: null,
            errors: [{
                    message: "event not found"
                }]
        });
    }
    catch (exception) {
        return response.status(500).send({
            results: null,
            errors: [{
                    message: "internal server error"
                }]
        });
    }
}));
app.post("/event", [
    express_validator_1.body('minAge').exists().isInt().withMessage("minAge must be a whole number"),
    express_validator_1.body('maxGuests').exists().isInt().withMessage("maxGuests must be a whole number"),
    express_validator_1.body('imageUrl').exists().isURL().withMessage("imageUrl must be a valid url"),
    express_validator_1.body('cost').exists().withMessage('cost must be defined'),
    express_validator_1.body('cost').isNumeric().withMessage("cost must be a number"),
    express_validator_1.body('description').exists().withMessage("descripton must be defined"),
    express_validator_1.body('artist').exists().withMessage("artist must be defined"),
    express_validator_1.body('scene').exists().withMessage("scene must be defined"),
    express_validator_1.body('location').exists().withMessage("location must be defined"),
], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(request);
    // 400
    if (!errors.isEmpty()) {
        return response.status(400).send({
            results: null,
            errors: errors.array().map((error) => {
                return {
                    message: error.msg,
                };
            }),
        });
    }
    try {
        // 201
        const eventId = yield manager.createEvent(request.body);
        if (eventId) {
            return response.status(201).send({
                results: eventId,
                errors: [],
            });
        }
        // 500
        return response.status(500).send({
            results: null,
            errors: [{
                    message: "there was an error creating event"
                }]
        });
    }
    catch (exception) {
        // 500
        return response.status(500).send({
            results: null,
            errors: [{
                    message: "there was an error creating event"
                }]
        });
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    manager = new manager_1.Manager();
    // TODO: remove test data
    yield manager._initializeTestData();
    console.log(`server started at http://localhost:${port}`);
}));
//# sourceMappingURL=index.js.map