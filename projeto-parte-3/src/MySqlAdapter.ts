import Connection from "./Connection";
import mysql from 'mysql2/promise';

export default class MySqlAdapter implements Connection {

    async query(statement: string, params: any): Promise<any> {

        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "renaty1129",
            database: "branas"
        });

        const [result] = await connection.query(statement, params);
        await connection.end();
        return result;
    }
}