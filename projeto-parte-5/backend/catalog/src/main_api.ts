import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";
import ProductRepositoryDatabase from "./infra/repository/ProductRepositoryDatabase";
import GetProducts from "./application/usecase/GetProducts";
import GetProduct from "./application/usecase/GetProduct";
import MySqlAdapter from "./infra/database/MySqlAdapter";

const connection = new MySqlAdapter();
const productRepository = new ProductRepositoryDatabase(connection);
const getProducts = new GetProducts(productRepository);
const getProduct = new GetProduct(productRepository);
const httpServer = new ExpressAdapter();
new HttpController(httpServer, getProducts, getProduct);
httpServer.listen(3003);
