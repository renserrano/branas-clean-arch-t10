import Produto from "./Produto";
import CupomDesconto from "./CupomDesconto";
import Cliente from "./Cliente";

export default class Pedido {

    total = 0;
    totalProdutos = 0;
    descontoValor = 0;
    produtos: Produto[];
    cliente: Cliente;

    addProduto(produto: Produto) {
        this.produtos.push(produto);
        this.totalProdutos += (produto.preco * produto.quantidade);
    }

    getTotal() {
        return this.totalProdutos - this.descontoValor;
    }

    aplicarCupomDesconto(cupom: CupomDesconto) {
        this.descontoValor = this.totalProdutos * (cupom.percentualDesconto/100);
    }

    constructor(cliente: Cliente) {
        this.cliente = cliente;
        this.produtos = [];
    }
}