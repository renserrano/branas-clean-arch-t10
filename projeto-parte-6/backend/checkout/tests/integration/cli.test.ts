import Checkout from "../../src/application/usecase/Checkout";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import CLIController from "../../src/infra/cli/CLIController";
import CLIHandler from "../../src/infra/cli/CLIHandler";
import Connection from "../../src/infra/database/Connection";
import CouponRepository from "../../src/application/repository/CouponRepository";
import CouponRepositoryDatabase from "../../src/infra/repository/CouponRepositoryDatabase";
import CurrencyGateway from "../../src/application/gateway/CurrencyGateway";
import CurrencyGatewayHttp from "../../src/infra/gateway/CurrencyGatewayHttp";
import HttpClient from "../../src/infra/http/HttpClient";
import MySqlAdapter from "../../src/infra/database/MySqlAdapter";
import OrderRepository from "../../src/application/repository/OrderRepository";
import OrderRepositoryDatabase from "../../src/infra/repository/OrderRepositoryDatabase";
import ProductRepository from "../../src/application/repository/ProductRepository";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDatabase";
import FreightGateway from "../../src/application/gateway/FreightGateway";
import FreightGatewayHttp from "../../src/infra/gateway/FreightGatewayHttp";
import CatalogGatewayHttp from "../../src/infra/gateway/CatalogGatewayHttp";
import CatalogGateway from "../../src/application/gateway/CatalogGateway";
import AuthGateway from "../../src/application/gateway/AuthGateway";

let connection: Connection;
let currencyGateway: CurrencyGateway;
let productRepository: ProductRepository;
let couponRepository: CouponRepository;
let orderRepository: OrderRepository;
let httpClient: HttpClient;
let freightGateway: FreightGateway;
let catalogGateway: CatalogGateway;
let authGateway: AuthGateway;

beforeEach(function () {
    connection = new MySqlAdapter();
    httpClient = new AxiosAdapter();
    currencyGateway = new CurrencyGatewayHttp(httpClient);
    freightGateway = new FreightGatewayHttp(httpClient);
    catalogGateway = new CatalogGatewayHttp(httpClient);
    // authGateway = new AuthGatewayHttp(httpClient);
    productRepository = new ProductRepositoryDatabase(connection);
    couponRepository = new CouponRepositoryDatabase(connection);
    orderRepository = new OrderRepositoryDatabase(connection);
});

afterEach(async function () {
    await connection.close();
});

test("Deve testar o cli", async function () {
    const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository, freightGateway, catalogGateway);
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