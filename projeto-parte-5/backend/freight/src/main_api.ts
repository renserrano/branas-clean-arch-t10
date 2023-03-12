import CalculateFreight from "./application/usecase/CalculateFreight";
import MySqlAdapter from "./infra/database/MySqlAdapter";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";

const connection = new MySqlAdapter();
const httpClient = new AxiosAdapter();
const calculateFreight = new CalculateFreight();
const httpServer = new ExpressAdapter();
// const httpServer = new HapiHttpServer();
new HttpController(httpServer, calculateFreight);
httpServer.listen(3002);
