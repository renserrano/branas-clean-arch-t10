import Connection from "./Connection";
import Order from "./Order";
import OrderGateway from "./OrderGateway";

export default class OrderGatewayDatabase implements OrderGateway {

    constructor(readonly Connection: Connection) {

    }

    get(id: string): Promise<Order> {
        throw new Error("Method not implemented.");
    }
    
    update(order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async save(order: Order) {
        await this.Connection.query("INSERT INTO branas.pedidos (serie, datapedido, valortotal, " +
            "valorprodutos, valorfrete, descontovalor) VALUES (?, ?, ?, ?, ?, ?)",
            [order.getNumeroSerie, new Date(), order.getTotal(), order.totalProdutos, order.getTotalFrete(), order.descontoValor]);

        for (const produto of order.produtos) {
            await this.Connection.query("INSERT INTO branas.pedidos_produtos (idproduto, quantidade, valorunitario, " +
                "valortotal, valorfrete) VALUES (?, ?, ?, ?, ?)",
                [produto.id, produto.quantidade, produto.preco, produto.preco * produto.quantidade, 0]);
        }
    }
}