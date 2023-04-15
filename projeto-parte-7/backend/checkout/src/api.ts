import express, { Request, Response } from "express";
import Checkout from "./application/usecase/Checkout";
import GetAllOrders from "./application/usecase/GetAllOrders";
import GetOrderByCode from "./application/usecase/GetOrderByCode";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import CouponRepositoryDatabase from "./infra/repository/CouponRepositoryDatabase";
import CurrencyGatewayHttp from "./infra/gateway/CurrencyGatewayHttp";
import MySqlAdapter from "./infra/database/MySqlAdapter";
import OrderRepositoryDatabase from "./infra/repository/OrderRepositoryDatabase";
import ProductRepositoryDatabase from "./infra/repository/ProductRepositoryDatabase";
import FreightGatewayHttp from "./infra/gateway/FreightGatewayHttp";
import CatalogGatewayHttp from "./infra/gateway/CatalogGatewayHttp";
import StockGatewayHttp from "./infra/gateway/StockGatewayHttp";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";

const app = express();
app.use(express.json());

app.post("/checkout", async function (req: Request, res: Response) {
    try {
        const connection = new MySqlAdapter();
        const httpClient = new AxiosAdapter();
        const currencyGateway = new CurrencyGatewayHttp(httpClient);
        const productRepository = new ProductRepositoryDatabase(connection);
        const couponRepository = new CouponRepositoryDatabase(connection);
        const orderRepository = new OrderRepositoryDatabase(connection);
        const freightGateway = new FreightGatewayHttp(httpClient);
        const catalogGateway = new CatalogGatewayHttp(httpClient);
        const stockGateway = new StockGatewayHttp(httpClient);
        const queue = new RabbitMQAdapter();
        await queue.connect();
        const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository, freightGateway, catalogGateway, stockGateway, queue);
        const output = await checkout.execute(req.body);
        await connection.close();
        res.json(output);
    } catch (e: any) {
        res.status(422).json({
            message: e.message
        });
    }
});

app.get("/orders", async function (req: Request, res: Response) {
    try {
        const connection = new MySqlAdapter();
        const orderRepository = new OrderRepositoryDatabase(connection);
        const Allorders = new GetAllOrders(orderRepository);
        const output = await Allorders.execute();
        await connection.close();
        res.json(output);
    } catch (e: any) {
        res.status(422).json({
            message: e.message
        });
    }
});

app.get("/orders/:code", async function (req: Request, res: Response) {
    try {
        const code = req.params.code;
        const connection = new MySqlAdapter();
        const orderRepository = new OrderRepositoryDatabase(connection);
        const OrderByCode = new GetOrderByCode(orderRepository);
        const output = await OrderByCode.execute(code);
        await connection.close();
        res.json(output);
    } catch (e: any) {
        res.status(422).json({
            message: e.message
        });
    }
});

app.listen(3000);