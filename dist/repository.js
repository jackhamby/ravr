"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const pg_1 = require("pg");
class Repository {
    constructor() {
        this.createEvent = (event) => __awaiter(this, void 0, void 0, function* () {
            return null;
        });
        this.readEvent = (eventId) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query("select * from event where event_id");
            return result.rows[0];
        });
        this.readAllEvents = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query("select * from events;");
            return result.rows;
        });
        this.readAllUsers = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query("select * from users;");
            return result.rows;
        });
        // TODO: remove this test data
        this.createUser = () => __awaiter(this, void 0, void 0, function* () {
            const fn = "jack";
            const ln = "hamby";
            const eml = "ppop@shit.com";
            const pne = "6023333412";
            const result = yield this.pool.query(`insert into users(
                first_name,
                last_name,
                email,
                phone
            ) values (
                '${fn}',
                '${ln}',
                '${eml}',
                '${pne}'
            ) returning user_id;`);
            const userId = result.rows[0].id;
            console.log(`created user ${userId}`);
            return userId;
        });
        this.createLocation = (userId, contactId) => __awaiter(this, void 0, void 0, function* () {
            const lt = 50;
            const lg = 50;
            const ln1 = "1500 lasalle";
            const ln2 = "Apt 304";
            const zp = "55403";
            const cty = "Minneapolis";
            const ste = "Minnesota";
            const result = yield this.pool.query(`insert into locations(
                latitude,
                longitude,
                line1,
                line2,
                zip,
                city,
                state,
                contact_id,
                user_id,
            ) values (
                '${lt}',
                '${lg}',
                '${ln1}',
                '${ln2}',
                '${zp}',
                '${cty}',
                '${ste}',
                '${contactId}',
                '${userId}'
            ) returning location_id;`);
            const locationId = result.rows[0].id;
            console.log(`created location ${locationId}`);
            return locationId;
        });
        this.createContact = (userId) => __awaiter(this, void 0, void 0, function* () {
            const fn = "nappy";
            const ln = "sama";
            const eml = "nappy@gmail.com";
            const pne = "6305513321";
            const uId = userId;
            const result = yield this.pool.query(`insert into contacts(
                first_name,
                last_name,
                email,
                phone,
                user_id
            ) values (
                '${fn}',
                '${ln}',
                '${eml}',
                '${pne}',
                '${uId}',
            );`);
            const contactId = result.rows[0].id;
            console.log(`created contact ${contactId}`);
            return contactId;
        });
        this._initializeTestData = () => __awaiter(this, void 0, void 0, function* () {
            // init things here
            const userId = yield this.createUser();
            const contactId = yield this.createContact(userId);
            const locationId = yield this.createLocation(userId, contactId);
        });
        this.pool = new pg_1.Pool();
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map