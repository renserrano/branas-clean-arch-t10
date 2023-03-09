import Customer from "../../src/domain/entity/Customer";
import Cpf from "../../src/domain/entity/Cpf";
import Order from "../../src/domain/entity/Order";
import OrderRepository from "../../src/application/repository/OrderRepository";
import OrderRepositoryDatabase from "../../src/infra/repository/OrderRepositoryDatabase";
import crypto from "crypto";
import GetAllOrders from "../../src/application/usecase/GetAllOrders";
import Connection from "../../src/infra/database/Connection";
import MySqlAdapter from "../../src/infra/database/MySqlAdapter";

let connection: Connection;
let orderRepository: OrderRepository;

beforeEach(function () {
    connection = new MySqlAdapter();
    orderRepository = new OrderRepositoryDatabase(connection); 
});

afterEach(async function () {
    await connection.close();
});

test("Deve retornar a lista de pedidos", async function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("351.849.680-83")));
    await orderRepository.save(order);
    const allOrders : GetAllOrders = new GetAllOrders(orderRepository);
    const output = await allOrders.execute();
	expect(output.orders.find(order => order.id === uuid)).toBeDefined();
});