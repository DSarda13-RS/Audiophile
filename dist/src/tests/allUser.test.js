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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const db_1 = require("../db");
const config_1 = require("../validations/config");
const path_1 = __importDefault(require("path"));
const supertest_1 = __importDefault(require("supertest"));
const baseURL = "http://localhost:3000";
(0, db_1.set_connection_pool)(config_1.pool_config_test.test);
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = app_1.default.listen(3000, () => {
        console.log('Server is listening on port 3000...');
    });
}));
describe("POST /user/register", () => {
    it("should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(baseURL).post("/user/register").attach('file', path_1.default.resolve(__dirname, 'DS.jpg')).field({ 'name': 'Dev', 'email': 'dev12345@gmail.com', 'password': 'test1234', 'address': 'Gotham City1' });
        yield expect(response.statusCode).toBe(200);
        // expect(response.body.error).toBe(null);
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.close();
    // await server.close();
    // await request(baseURL).delete(`/todo/${newTodo.id}`)
}));
