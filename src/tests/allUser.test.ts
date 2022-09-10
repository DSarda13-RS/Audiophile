import app from "../app";
import {set_connection_pool} from '../db';
import {pool_config_test} from "../validations/config";
import path from 'path';

import request from 'supertest';
import { Server } from "http";

const baseURL = "http://localhost:3000";

set_connection_pool(pool_config_test.test);

let server: Server;
beforeAll(async () => {
    server = app.listen(3000,()=>{
        console.log('Server is listening on port 3000...');
    })
});

describe("POST /user/register", () => {
    it("should return 200",  async() => {
        const response = await request(baseURL).post("/user/register").attach('file',path.resolve(__dirname,'DS.jpg')).field({'name':'Dev','email':'dev12345@gmail.com','password':'test1234','address':'Gotham City1'})
        await expect(response.statusCode).toBe(200);
        // expect(response.body.error).toBe(null);
    });

});

afterAll(async () => {
    await server.close();
    // await server.close();
    // await request(baseURL).delete(`/todo/${newTodo.id}`)
});
