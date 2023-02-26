import express, { Request, Response } from "express";
import Checkout from "./application/usecase/Checkout";
import GetAllOrders from "./application/usecase/GetAllOrders";
import GetOrderByCode from "./application/usecase/GetOrderByCode";
const app = express();
app.use(express.json());

app.post("/checkout", async function (req: Request, res: Response) {
    try {
        const checkout = new Checkout();
        const output = await checkout.execute(req.body);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({
            message: e.message
        });
    }
});

app.get("/orders", async function (req: Request, res: Response) {
    try {
        const Allorders = new GetAllOrders();
        const output = await Allorders.execute();
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
        const OrderByCode = new GetOrderByCode();
        const output = await OrderByCode.execute(code);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({
            message: e.message
        });
    }
});

app.listen(3000);