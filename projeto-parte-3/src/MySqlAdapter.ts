import Connection from "./Connection";
import msq from "mysql";

export default class MySqlAdapter implements Connection {

    async query(statement: string, params: any): Promise<any> {
        const connection = msq.createConnection({
            host: "localhost",
            user: "root",
            password: "renaty1129",
            database: "branas"
        });
        const result = connection.query(statement, params);
        connection.end();
        return result;
    }
}