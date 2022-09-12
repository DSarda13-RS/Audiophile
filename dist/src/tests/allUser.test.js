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
const app_1 = require("../app");
const db_1 = require("../db");
const config_1 = require("../validations/config");
const path_1 = __importDefault(require("path"));
const supertest_1 = __importDefault(require("supertest"));
const baseURL = "http://localhost:3000";
(0, db_1.set_connection_pool)(config_1.pool_config_test.test);
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = app_1.servers;
}));
describe("POST /user/register", () => {
    it("should return 400, if uploaded file is not image", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(baseURL).post("/user/register").attach('file', path_1.default.resolve(__dirname, 'DS.txt')).field({ 'name': 'Dev', 'email': 'devsarda789@gmail.com', 'password': 'test1234', 'address': 'Gotham City1' });
        yield expect(response.statusCode).toBe(400);
    }));
    it("should return 400, if provided name is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(baseURL).post("/user/register").attach('file', path_1.default.resolve(__dirname, 'DS.jpg')).field({ 'name': 123, 'email': 'devsarda789@gmail.com', 'password': 'test1234', 'address': 'Gotham City1' });
        yield expect(response.statusCode).toBe(400);
    }));
    it("should return 400, if provided email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(baseURL).post("/user/register").attach('file', path_1.default.resolve(__dirname, 'DS.jpg')).field({ 'name': 'Dev', 'email': 'devsarda789gmail.com', 'password': 'test1234', 'address': 'Gotham City1' });
        yield expect(response.statusCode).toBe(400);
    }));
    it("should return 400, if provided password is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(baseURL).post("/user/register").attach('file', path_1.default.resolve(__dirname, 'DS.jpg')).field({ 'name': 'Dev', 'email': 'devsarda789@gmail.com', 'password': 'tes1234', 'address': 'Gotham City1' });
        yield expect(response.statusCode).toBe(400);
    }));
    it("should return 400, if address is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(baseURL).post("/user/register").attach('file', path_1.default.resolve(__dirname, 'DS.jpg')).field({ 'name': 'Dev', 'email': 'devsarda789@gmail.com', 'password': 'test1234' });
        yield expect(response.statusCode).toBe(400);
    }));
    it("should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(baseURL).post("/user/register").attach('file', path_1.default.resolve(__dirname, 'DS.jpg')).field({ 'name': 'Dev', 'email': 'devsarda789@gmail.com', 'password': 'test1234', 'address': 'Gotham City1' });
        yield expect(response.statusCode).toBe(200);
    }));
    it("should return 409, if email already used", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(baseURL).post("/user/register").attach('file', path_1.default.resolve(__dirname, 'DS.jpg')).field({ 'name': 'Dev', 'email': 'devsarda789@gmail.com', 'password': 'test1234', 'address': 'Gotham City1' });
        yield expect(response.statusCode).toBe(409);
    }));
});
let accessToken;
describe("POST /user/login", () => {
    it("should return 403, if email is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            email: 'devsarda789gmail.com',
            password: 'test1234'
        };
        const response = yield (0, supertest_1.default)(baseURL).post("/user/login").send(body);
        yield expect(response.statusCode).toBe(403);
    }));
    it("should return 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            email: 'devsarda789@gmail.com',
            password: 'tes1234'
        };
        const response = yield (0, supertest_1.default)(baseURL).post("/user/login").send(body);
        yield expect(response.statusCode).toBe(403);
    }));
    it("should return 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            email: 'devsardaa1@gmail.com',
            password: 'test1234'
        };
        const response = yield (0, supertest_1.default)(baseURL).post("/user/login").send(body);
        yield expect(response.statusCode).toBe(403);
    }));
    it("should return 401", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            email: 'devsarda789@gmail.com',
            password: 'test12345'
        };
        const response = yield (0, supertest_1.default)(baseURL).post("/user/login").send(body);
        yield expect(response.statusCode).toBe(401);
    }));
    it("should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            email: 'devsarda789@gmail.com',
            password: 'test1234'
        };
        const response = yield (0, supertest_1.default)(baseURL).post("/user/login").send(body);
        accessToken = response.body.accessToken;
        yield expect(response.statusCode).toBe(200);
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.close();
}));
