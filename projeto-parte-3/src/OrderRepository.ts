export default interface OrderRepository {
    get(id: string): Promise<any>;
    save(order: any): Promise<void>;
    count(): Promise<number>;
}