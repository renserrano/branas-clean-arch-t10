import Produto from "./Produto";

export default class Pedido {

    total = 0;
    produtos: Produto[];

    addProduto(produto) {
        this.produtos.push(produto);
        this.total += (produto.preco * produto.quantidade);
    }

    getTotal() {
        return this.total;
    }

    aplicarCupomDesconto(cupom) {
        return 0;
    }

    constructor() {
        this.produtos = [];

    }
}