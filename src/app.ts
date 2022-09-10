import express = require('express');
const app = express();
import * as dotenv from 'dotenv'
dotenv.config()

import {set_connection_pool} from './db';
import {pool_conf} from "./validations/config";
import {PoolConfig} from "pg";

import user from './routes/user';
import seller from './routes/seller';
import admin from './routes/admin';
import bodyParser from "body-parser";

app.use(express.json())
app.use('/user',user)
app.use('/seller',seller)
app.use('/admin',admin)

set_connection_pool(pool_conf.dev as PoolConfig);

app.listen(3000,()=>{
    console.log('Server is listening on port 3000...');
})

export default app

