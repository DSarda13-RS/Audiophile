import {servers} from "../app";
import {set_connection_pool} from '../db';
import {pool_config_test} from "../validations/config";
import path from 'path';

import request from 'supertest';
import { Server } from "http";
const baseURL = "http://localhost:3000";

set_connection_pool(pool_config_test.test);

let server: Server;
beforeAll(async () => {
    server = servers;
});

describe("POST /user/register", () => {
    it("should return 400, if uploaded file is not image",  async() => {
        const response = await request(baseURL).post("/user/register").attach('file',path.resolve(__dirname,'DS.txt')).field({'name':'Dev','email':'devsarda789@gmail.com','password':'test1234','address':'Gotham City1'})
        await expect(response.statusCode).toBe(400);
    });
    it("should return 400, if provided name is invalid",  async() => {
        const response = await request(baseURL).post("/user/register").attach('file',path.resolve(__dirname,'DS.jpg')).field({'name':123,'email':'devsarda789@gmail.com','password':'test1234','address':'Gotham City1'})
        await expect(response.statusCode).toBe(400);
    });
    it("should return 400, if provided email is invalid",  async() => {
        const response = await request(baseURL).post("/user/register").attach('file',path.resolve(__dirname,'DS.jpg')).field({'name':'Dev','email':'devsarda789gmail.com','password':'test1234','address':'Gotham City1'})
        await expect(response.statusCode).toBe(400);
    });
    it("should return 400, if provided password is invalid",  async() => {
        const response = await request(baseURL).post("/user/register").attach('file',path.resolve(__dirname,'DS.jpg')).field({'name':'Dev','email':'devsarda789@gmail.com','password':'tes1234','address':'Gotham City1'})
        await expect(response.statusCode).toBe(400);
    });
    it("should return 400, if address is not provided",  async() => {
        const response = await request(baseURL).post("/user/register").attach('file',path.resolve(__dirname,'DS.jpg')).field({'name':'Dev','email':'devsarda789@gmail.com','password':'test1234'})
        await expect(response.statusCode).toBe(400);
    });
    it("should return 200",  async() => {
        const response = await request(baseURL).post("/user/register").attach('file',path.resolve(__dirname,'DS.jpg')).field({'name':'Dev','email':'devsarda789@gmail.com','password':'test1234','address':'Gotham City1'})
        await expect(response.statusCode).toBe(200);
    });
    it("should return 409, if email already used",  async() => {
        const response = await request(baseURL).post("/user/register").attach('file',path.resolve(__dirname,'DS.jpg')).field({'name':'Dev','email':'devsarda789@gmail.com','password':'test1234','address':'Gotham City1'})
        await expect(response.statusCode).toBe(409);
    });
});

let accessToken: string;

describe("POST /user/login", () => {
    it("should return 403, if email is not valid",  async() => {
        const body = {
            email: 'devsarda789gmail.com',
            password: 'test1234'
        };
        const response = await request(baseURL).post("/user/login").send(body);
        await expect(response.statusCode).toBe(403);
    });
    it("should return 403",  async() => {
        const body = {
            email: 'devsarda789@gmail.com',
            password: 'tes1234'
        };
        const response = await request(baseURL).post("/user/login").send(body);
        await expect(response.statusCode).toBe(403);
    });
    it("should return 403",  async() => {
        const body = {
            email: 'devsardaa1@gmail.com',
            password: 'test1234'
        };
        const response = await request(baseURL).post("/user/login").send(body);
        await expect(response.statusCode).toBe(403);
    });
    it("should return 401",  async() => {
        const body = {
            email: 'devsarda789@gmail.com',
            password: 'test12345'
        };
        const response = await request(baseURL).post("/user/login").send(body);
        await expect(response.statusCode).toBe(401);
    });
    it("should return 200",  async() => {
        const body = {
            email: 'devsarda789@gmail.com',
            password: 'test1234'
        };
        const response = await request(baseURL).post("/user/login").send(body);
        accessToken = response.body.accessToken;
        await expect(response.statusCode).toBe(200);
    });
});

afterAll(async () => {
    await server.close();
});
