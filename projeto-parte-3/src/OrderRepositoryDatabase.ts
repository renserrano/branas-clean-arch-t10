import Connection from "./Connection";
import MySqlAdapter from "./MySqlAdapter";
import OrderRepository from "./OrderRepository";

export default class OrderRepositoryDatabase implements OrderRepository {

    constructor(readonly connection: Connection = new MySqlAdapter()) {
    }

    async get(id: string): Promise<any> {
        const [orderData] = await this.connection.query("select * from cccat10.order where id_order = ?", [id]);
        return orderData;
    }

    async save(order: any) {
        await this.connection.query("insert into cccat10.order (id_order, cpf, code, total, freight) values (?, ?, ?, ?, ?)",
            [order.id_order, order.cpf, order.code, order.total, order.freight]);

        for (const item of order.items) {
            await this.connection.query("insert into cccat10.item (id_order, id_product, price, quantity) values (?, ?, ?, ?)",
                [item.idOrder, item.irProduct, item.price, item.quantity]);
        }
    }

    async count(): Promise<number> {
        const [options] = await this.connection.query("select count(*) from cccat10.order", []);
        return parseInt(options.count);
    };
}