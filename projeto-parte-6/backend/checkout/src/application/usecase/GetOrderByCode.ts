import OrderRepository from "../repository/OrderRepository";

export default class GetOrderByCode {

    constructor(
        readonly orderRepository: OrderRepository
    ) {
    }

    async execute(code: string): Promise<Output> {
        const order = await this.orderRepository.getByCode(code);
        const output: Output = {
            code: order.getCode(),
            total: order.getTotal(),
            freight: order.freight
        };
        return output;
    }
}

type Output = {
    code: string,
    total: number,
    freight: number
}