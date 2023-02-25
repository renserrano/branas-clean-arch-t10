import Cpf from "./domain/entity/Cpf";
import Item from "./domain/entity/Item";
import Order from "./domain/entity/Order";
import Customer from "./Customer";
import Connection from "./Connection";
import MySqlAdapter from "./MySqlAdapter";
import OrderRepository from "./OrderRepository";

export default class OrderRepositoryDatabase implements OrderRepository {

    constructor(readonly connection: Connection = new MySqlAdapter()) {
    }

    async get(id: string): Promise<Order> {
        const [orderData] = await this.connection.query("select * from cccat10.order where id_order = ?", [id]);
        const order = new Order(orderData.id_order, new Customer("teste", new Cpf("653.497.160-77")), undefined, 1, new Date());
        const itemsData = await this.connection.query("select * from cccat10.item where id_order = ?", [id]);
        for (const itemData of itemsData) {
            order.items.push(new Item(itemData.id_product, parseFloat(itemData.price), itemData.quantity, "BRL"));
        }
        return order;
    }

    async save(order: Order): Promise<void> {
        await this.connection.query("insert into cccat10.order (id_order, cpf, code, total, freight) values (?, ?, ?, ?, ?)",
            [order.idOrder, order.customer.cpf.value, order.code, order.getTotal(), order.freight]);

        for (const item of order.items) {
            await this.connection.query("insert into cccat10.item (id_order, id_product, price, quantity) values (?, ?, ?, ?)",
                [order.idOrder, item.idProduct, item.price, item.quantity]);
        }
    }

    async count(): Promise<number> {
        const [options] = await this.connection.query("select count(*) from cccat10.order", []);
        return parseInt(options.count);
    };

    async all(): Promise<Order[]> {
        const ordersData = await this.connection.query("select * from cccat10.order", []);
        let Orders: Order[] = [];
        for (const orderData of ordersData) {
            let order: Order = new Order(orderData.id_order, new Customer("teste", new Cpf("653.497.160-77")), undefined, 1, new Date())
            const itemsData = await this.connection.query("select * from cccat10.item where id_order = ?", [orderData.id_order]);
            for (const itemData of itemsData) {
                order.items.push(new Item(itemData.id_product, parseFloat(itemData.price), itemData.quantity, "BRL"));
            }
            Orders.push(order);
        }
        return Orders;
    };
}