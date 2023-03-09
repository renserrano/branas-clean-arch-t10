import Checkout from "../src/application/usecase/Checkout";
import AxiosAdapter from "../src/infra/http/AxiosAdapter";
import CLIController from "../src/infra/cli/CLIController";
import CLIHandler from "../src/infra/cli/CLIHandler";
import Connection from "../src/infra/database/Connection";
import CouponRepository from "../src/application/repository/CouponRepository";
import CouponRepositoryDatabase from "../src/infra/repository/CouponRepositoryDatabase";
import CurrencyGateway from "../src/application/gateway/CurrencyGateway";
import CurrencyGatewayHttp from "../src/infra/gateway/CurrencyGatewayHttp";
import HttpClient from "../src/infra/http/HttpClient";
import MySqlAdapter from "../src/infra/database/MySqlAdapter";
import OrderRepository from "../src/application/repository/OrderRepository";
import OrderRepositoryDatabase from "../src/infra/repository/OrderRepositoryDatabase";
import ProductRepository from "../src/application/repository/ProductRepository";
import ProductRepositoryDatabase from "../src/infra/repository/ProductRepositoryDatabase";

let connection: Connection;
let currencyGateway: CurrencyGateway;
let productRepository: ProductRepository;
let couponRepository: CouponRepository;
let orderRepository: OrderRepository;
let httpClient: HttpClient;

beforeEach(function () {
    connection = new MySqlAdapter();
    httpClient = new AxiosAdapter();
    currencyGateway = new CurrencyGatewayHttp(httpClient);
    productRepository = new ProductRepositoryDatabase(connection);
    couponRepository = new CouponRepositoryDatabase(connection);
    orderRepository = new OrderRepositoryDatabase(connection);
});

afterEach(async function () {
    await connection.close();
});

test("Deve testar o cli", async function () {
    const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
    let output: any;
    const handler = new class extends CLIHandler {
        write(text: string): void {
            output = JSON.parse(text);
        }
    };
    new CLIController(handler, checkout);
    handler.type("set-cpf 407.302.170-27");
    handler.type("add-item 1 1");
    handler.type("add-item 2 1");
    handler.type("add-item 3 3");
    await handler.type("checkout");
    expect(output.total).toBe(6090);
    expect(output.freight).toBe(280);
});