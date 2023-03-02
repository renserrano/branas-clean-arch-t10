import Customer from "../src/Customer";
import Cpf from "../src/domain/entity/Cpf";
import Order from "../src/domain/entity/Order";
import OrderRepository from "../src/OrderRepository";
import OrderRepositoryDatabase from "../src/OrderRepositoryDatabase";
import crypto from "crypto";
import GetAllOrders from "../src/application/usecase/GetAllOrders";

test("Deve retornar a lista de pedidos", async function () {
    const uuid = crypto.randomUUID();
    console.log(uuid);
    const order = new Order(uuid, new Customer("Renan", new Cpf("351.849.680-83")));
    const orderRepository: OrderRepository = new OrderRepositoryDatabase();
    await orderRepository.save(order);
    const allOrders : GetAllOrders = new GetAllOrders();
    const output = await allOrders.execute();
	expect(output.orders.find(order => order.id === uuid)).toBeDefined();
});