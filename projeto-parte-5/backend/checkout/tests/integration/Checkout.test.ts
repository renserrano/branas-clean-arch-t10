import Checkout from "../../src/application/usecase/Checkout";
import sinon from "sinon";
import CurrencyGatewayHttp from "../../src/infra/gateway/CurrencyGatewayHttp";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDatabase";
import CouponRepositoryDatabase from "../../src/infra/repository/CouponRepositoryDatabase";
import CurrencyGateway from "../../src/application/gateway/CurrencyGateway";
import ProductRepository from "../../src/application/repository/ProductRepository";
import crypto from "crypto";
import GetOrder from "../../src/application/usecase/GetOrder";
import OrderRepositoryDatabase from "../../src/infra/repository/OrderRepositoryDatabase";
import Product from "../../src/domain/entity/Product";
import MySqlAdapter from "../../src/infra/database/MySqlAdapter";
import Connection from "../../src/infra/database/Connection";
import CouponRepository from "../../src/application/repository/CouponRepository";
import OrderRepository from "../../src/application/repository/OrderRepository";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import HttpClient from "../../src/infra/http/HttpClient";
import FreightGatewayHttp from "../../src/infra/gateway/FreightGatewayHttp";
import FreightGateway from "../../src/application/gateway/FreightGateway";
import CatalogGatewayHttp from "../../src/infra/gateway/CatalogGatewayHttp";
import CatalogGateway from "../../src/application/gateway/CatalogGateway";

let checkout: Checkout;
let getOrder: GetOrder;
let connection: Connection;
let currencyGateway: CurrencyGateway;
let freightGateway: FreightGateway;
let catalogGateway: CatalogGateway;
let productRepository: ProductRepository;
let couponRepository: CouponRepository;
let orderRepository:  OrderRepository;
let httpClient: HttpClient;

beforeEach(function () {
    connection = new MySqlAdapter();
    httpClient = new AxiosAdapter();
    currencyGateway = new CurrencyGatewayHttp(httpClient);
    freightGateway = new FreightGatewayHttp(httpClient);
    catalogGateway = new CatalogGatewayHttp(httpClient);
    productRepository = new ProductRepositoryDatabase(connection);
    couponRepository = new CouponRepositoryDatabase(connection);
    orderRepository = new OrderRepositoryDatabase(connection);
    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository, freightGateway, catalogGateway);
    getOrder = new GetOrder(orderRepository);
});

afterEach(async function () {
    await connection.close();
});

test("Não deve aceitar um pedido com cpf inválido", async function () {
    const input = {
        cpf: "406.302.170-27",
        items: []
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Deve criar um pedido vazio", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: []
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(0);
});

test("Deve criar um pedido com 3 produtos", async function () {
    const uuid = crypto.randomUUID();
    const input = {
        uuid,
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ]
    };
    await checkout.execute(input);
    const output = await getOrder.execute(uuid);
    expect(output.total).toBe(6090);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        coupon: "VALE20"
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(4872);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto expirado", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        coupon: "VALE10"
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(6090);
});

test("Não deve criar um pedido com quantidade negativa", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: -1 }
        ]
    };
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid quantity"));
});

test("Não deve criar um pedido com item duplicado", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 1, quantity: 1 }
        ]
    };
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Duplicated item"));
});

test("Deve criar um pedido com 1 produto calculando o frete", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 3 }
        ],
        from: "22060030",
        to: "88015600"
    };
    const output = await checkout.execute(input);
    expect(output.freight).toBe(90);
    expect(output.total).toBe(3090);
});

test("Não deve criar um pedido se o produto tiver alguma dimensão negativa", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 4, quantity: 1 }
        ]
    };
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid dimension"));
});

test("Deve criar um pedido com 1 produto calculando o frete com valor mínimo", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 3, quantity: 1 }
        ],
        from: "22060030",
        to: "88015600"
    };
    const output = await checkout.execute(input);
    expect(output.freight).toBe(10);
    expect(output.total).toBe(40);
});

test("Deve criar um pedido com 1 produto em dólar usando um stub", async function () {
    const stubCurrencyGateway = sinon.stub(CurrencyGatewayHttp.prototype, "getCurrencies").resolves({
        usd: 3
    });
    const stubProductRepository = sinon.stub(ProductRepositoryDatabase.prototype, "getProduct").resolves(
        new Product(5, "A", 1000, 10, 10, 10, 10, "USD")
    )
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 5, quantity: 1 }
        ]
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    stubCurrencyGateway.restore();
    stubProductRepository.restore();
});

test("Deve criar um pedido com 3 produtos com cupom de desconto com spy", async function () {
    const spyCouponRepository = sinon.spy(CouponRepositoryDatabase.prototype, "getCoupon");
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        coupon: "VALE20"
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(4872);
    expect(spyCouponRepository.calledOnce).toBeTruthy();
    expect(spyCouponRepository.calledWith("VALE20")).toBeTruthy();
    spyCouponRepository.restore();
});

test("Deve criar um pedido com 1 produto em dólar usando um mock", async function () {
    const mockCurrencyGateway = sinon.mock(CurrencyGatewayHttp.prototype);
    mockCurrencyGateway.expects("getCurrencies").once().resolves({
        usd: 3
    });
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 5, quantity: 1 }
        ]
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    mockCurrencyGateway.verify();
    mockCurrencyGateway.restore();
});

test("Deve criar um pedido com 1 produto em dólar usando um fake", async function () {
    const currencyGateway: CurrencyGateway = {
        async getCurrencies(): Promise<any> {
            return {
                usd: 3
            }
        }
    }
    const productRepository: ProductRepository = {
        async getProduct(idProduct: number): Promise<any> {
            return new Product(6, "A", 1000, 10, 10, 10, 10, "USD");
        },
        async getProducts(): Promise<Product[]> {
            return [];
        }
    }
    const catalogGatewayStub = sinon.stub(CatalogGatewayHttp.prototype, "getProduct").resolves(new Product(6, "A", 1000, 10, 10, 10, 10, "USD"));
    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository, freightGateway, catalogGateway);
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 6, quantity: 1 }
        ]
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    catalogGatewayStub.restore();
});

test("Deve criar um pedido e verificar o código de série", async function () {
    const stub = sinon.stub(OrderRepositoryDatabase.prototype, "count").resolves(1);
    const uuid = crypto.randomUUID();
    const input = {
        uuid,
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ]
    };
    await checkout.execute(input);
    const output = await getOrder.execute(uuid);
    expect(output.code).toBe("202300000001");
    stub.restore();
});