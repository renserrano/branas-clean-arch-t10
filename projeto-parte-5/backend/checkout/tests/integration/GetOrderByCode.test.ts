import Customer from "../../src/domain/entity/Customer";
import Cpf from "../../src/domain/entity/Cpf";
import Order from "../../src/domain/entity/Order";
import OrderRepository from "../../src/application/repository/OrderRepository";
import OrderRepositoryDatabase from "../../src/infra/repository/OrderRepositoryDatabase";
import crypto from "crypto";
import CurrencyTable from "../../src/domain/entity/CurrencyTable";
import GetOrderByCode from "../../src/application/usecase/GetOrderByCode";
import MySqlAdapter from "../../src/infra/database/MySqlAdapter";
import Connection from "../../src/infra/database/Connection";

test("Deve retornar um pedido com base no código", async function () {
    const uuid = crypto.randomUUID();
    const sequence = 1522;    
    const order = new Order(uuid, new Customer("Renan", new Cpf("351.849.680-83")), new CurrencyTable(), sequence);
    const connection : Connection = new MySqlAdapter();
    const orderRepository: OrderRepository = new OrderRepositoryDatabase(connection);
    orderRepository.save(order);
    const getOrderByCode : GetOrderByCode = new GetOrderByCode(orderRepository);
    const code = `${order.date.getFullYear()}${new String(sequence).padStart(8, "0")}`
    const output = await getOrderByCode.execute(code);
    await connection.close();
	expect(output.code).toBe(code);
});