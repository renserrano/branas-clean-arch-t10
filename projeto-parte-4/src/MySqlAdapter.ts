import Connection from "./Connection";
import mysql from 'mysql2/promise';
import dotenv from "dotenv";

export default class MySqlAdapter implements Connection {

    async query(statement: string, params: any): Promise<any> {

        dotenv.config();

        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: process.env.PASS_DATABASE,
            database: "branas"
        });

        const [result] = await connection.query(statement, params);
        await connection.end();
        return result;
    }
}