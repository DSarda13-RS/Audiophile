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

afterAll(async () => {
    await server.close();
});
