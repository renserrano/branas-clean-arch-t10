import Checkout from "./application/usecase/Checkout";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import CouponRepositoryDatabase from "./infra/repository/CouponRepositoryDatabase";
import CurrencyGatewayHttp from "./infra/gateway/CurrencyGatewayHttp";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HapiHttpServer from "./infra/http/HapiAdapter";
import HttpController from "./infra/http/HttpController";
import MySqlAdapter from "./infra/database/MySqlAdapter";
import OrderRepositoryDatabase from "./infra/repository/OrderRepositoryDatabase";
import ProductRepositoryDatabase from "./infra/repository/ProductRepositoryDatabase";
import GetProducts from "./application/usecase/GetProducts";
import FreightGatewayHttp from "./infra/gateway/FreightGatewayHttp";
import CatalogGatewayHttp from "./infra/gateway/CatalogGatewayHttp";
import AuthGatewayHttp from "./infra/gateway/AuthGatewayHttp";
import AuthDecorator from "./application/decorator/AuthDecorator";
import StockGatewayHttp from "./infra/gateway/StockGatewayHttp";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import QueueController from "./infra/queue/QueueController";

async function main() {
    const connection = new MySqlAdapter();
    const httpClient = new AxiosAdapter();
    const currencyGateway = new CurrencyGatewayHttp(httpClient);
    const freighGateway = new FreightGatewayHttp(httpClient);
    const catalogGateway = new CatalogGatewayHttp(httpClient);
    const productRepository = new ProductRepositoryDatabase(connection);
    const couponRepository = new CouponRepositoryDatabase(connection);
    const orderRepository = new OrderRepositoryDatabase(connection);
    const authGateway = new AuthGatewayHttp(httpClient);
    const stockGateway = new StockGatewayHttp(httpClient);
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository, freighGateway, catalogGateway, stockGateway, queue);
    const getProducts = new GetProducts(productRepository);
    const httpServer = new ExpressAdapter();
    //const httpServer = new HapiHttpServer();
    new QueueController(queue, checkout);
    new HttpController(httpServer, new AuthDecorator(checkout, authGateway), getProducts, queue);
    httpServer.listen(3000);
}

main();