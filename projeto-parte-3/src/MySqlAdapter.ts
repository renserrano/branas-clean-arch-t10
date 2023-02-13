import Connection from "./Connection";
import msq from "mysql";

export default class MySqlAdapter implements Connection {

    msq: any;

    constructor () {
        this.msq = msq.createConnection({
            host: "localhost",
            user: "root",
            password: "renaty1129",
            database: "branas"
        });
    }

    async query(statement: string, params: any): Promise<any> {
        return this.msq.query(statement, params);
    }

    async close(): Promise<void> {
        return this.msq.end();
    }    
}