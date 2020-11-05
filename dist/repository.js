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
        this.connect = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // this.client = await MongoClient.connect(this.databaseUrl);k
                // await this.pool.connect()
            }
            catch (e) {
                throw new Error(('Failed to connect to database server'));
            }
        });
        this.createEvent = (event) => __awaiter(this, void 0, void 0, function* () {
            // insert
            // into events(name, minAge, maxGuests, description, scene, cost)
            // values('jacks cool event', 12, 200, 'a super cool event', 'indie/rock', 5.123);
            return null;
        });
        this.readEvent = (eventId) => __awaiter(this, void 0, void 0, function* () {
            //     const database: Db = this.client.db(this.databaseName);
            //     try{
            //         const event = await database.collection(this.eventCollectionName).findOne<Event>({ _id: new ObjectId(eventId)});
            //         return event;
            //     }
            //     catch {
            return null;
            //     }
        });
        this.readAllEvents = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query("select * from events;");
            return result.rows;
        });
        this.disconnect = () => {
            //   this.client.close();
        };
        this.databaseHost = "127.0.0.1";
        this.databaseUser = null;
        this.databaseName = "ravr";
        this.databasePassword = null;
        this.databasePort = 5432;
        this.pool = new pg_1.Pool({
            user: this.databaseUser,
            host: this.databaseHost,
            database: this.databaseName,
            password: this.databasePassword,
            port: this.databasePort,
        });
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map