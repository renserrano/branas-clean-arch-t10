import SimulateFreight from "../../src/application/usecase/SimulateFreight";
import Connection from "../../src/infra/database/Connection";
import CurrencyGatewayHttp from "../../src/infra/gateway/CurrencyGatewayHttp";
import MySqlAdapter from "../../src/infra/database/MySqlAdapter";
import ProductRepository from "../../src/application/repository/ProductRepository";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDatabase";
import FreightGatewayHttp from "../../src/infra/gateway/FreightGatewayHttp";
import FreightGateway from "../../src/application/gateway/FreightGateway";
import HttpClient from "../../src/infra/http/HttpClient";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";

let simulateFreight: SimulateFreight;
let connection: Connection;
let productRepository: ProductRepository;
let freightGateway : FreightGateway;
let httpClient : HttpClient;

beforeEach(function () {
    connection = new MySqlAdapter();
    productRepository = new ProductRepositoryDatabase(connection);
	httpClient = new AxiosAdapter();
	freightGateway = new FreightGatewayHttp(httpClient);
	simulateFreight = new SimulateFreight(productRepository, freightGateway);
});

afterEach(async function () {
    await connection.close();
});

test("Deve calcular o frete para um pedido com 3 itens", async function () {
	const input = {
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 }
		],
		from: "22060030",
		to: "88015600"
	};
	const output = await simulateFreight.execute(input);
	expect(output.freight).toBe(280);
});