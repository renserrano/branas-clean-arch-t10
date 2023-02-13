import Order from "./Order";

export default interface OrderGateway {
    get(id: string): Promise<Order>;
    save(order: Order): Promise<void>;
    update(order: Order): Promise<void>;
}