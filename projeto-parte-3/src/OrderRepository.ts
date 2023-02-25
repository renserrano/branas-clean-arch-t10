import Order from "./domain/entity/Order";

export default interface OrderRepository {
    get(id: string): Promise<Order>;
    save(order: Order): Promise<void>;
    count(): Promise<number>;
    all(): Promise<Order[]>;
}