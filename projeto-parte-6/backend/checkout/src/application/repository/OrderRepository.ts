import Order from "../../domain/entity/Order";

export default interface OrderRepository {
    getById(id: string): Promise<Order>;
    save(order: Order): Promise<void>;
    count(): Promise<number>;
    all(): Promise<Order[]>;
    getByCode(code: string): Promise<Order>;
}