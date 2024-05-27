import express from "express";
import {configDotenv} from "dotenv";
import {skinportRoutes} from "./routers/skinport.router";
import {usersRouter} from "./routers/users.router";
import {Pool, PoolConfig} from "pg";
configDotenv()
export const app = express()

app.use('/api/skinport', skinportRoutes);
app.use('/api/user', usersRouter);

app.use(express.json())

export const settings = {
    skinPort_Api_Url:process.env.SKINPORT_API_URL,
    port: process.env.PORT,
    default_app_id:730,
    default_currency:'EUR',
    default_userId:1,
    default_amount:100
}

export const databaseSettings:PoolConfig = {
    host:process.env.POSTGRESQL_HOST,
    database:process.env.POSTGRESQL_DATABASE,
    user:process.env.POSTGRESQL_USERNAME,
    password:process.env.POSTGRESQL_PASSWORD,
    port: Number(process.env.POSTGRESQL_PORT)
}

export const pool = new Pool(databaseSettings);
