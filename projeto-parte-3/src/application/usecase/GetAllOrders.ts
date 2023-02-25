import OrderRepository from "../../OrderRepository";
import OrderRepositoryDatabase from "../../OrderRepositoryDatabase";

export default class GetAllOrders {

    constructor(
        readonly orderRepository: OrderRepository = new OrderRepositoryDatabase()
    ) {
    }

    async execute(): Promise<Output> {
        const orders = await this.orderRepository.all();
        let output: Output = { orders: [] };

        for (const order of orders) {
            output.orders.push({
                id: order.idOrder || "",
                cpf: order.customer.cpf.value,
                code: order.getCode(),
                total: order.getTotal(),
                freight: order.freight
            });

        };
        return output;
    }
}

type Output = {
    orders: {
        id: string,
        cpf: string,
        code: string,
        total: number,
        freight: number
    }[]
}