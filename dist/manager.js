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
exports.Manager = void 0;
const repository_1 = require("./repository");
class Manager {
    constructor() {
        this.initialize = () => __awaiter(this, void 0, void 0, function* () {
            yield this.repository.connect();
        });
        this.readEvent = (eventId) => __awaiter(this, void 0, void 0, function* () {
            const event = yield this.repository.readEvent(eventId);
            if (event) {
                delete event._id;
            }
            return event;
        });
        this.readAllEvents = () => __awaiter(this, void 0, void 0, function* () {
            const events = yield this.repository.readAllEvents();
            return events;
        });
        this.createEvent = (event) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.createEvent(event);
        });
        this.repository = new repository_1.Repository();
    }
}
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map