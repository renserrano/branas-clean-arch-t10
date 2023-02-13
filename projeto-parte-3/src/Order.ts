import Produto from "./Produto";
import CupomDesconto from "./CupomDesconto";
import Cliente from "./Cliente";

export default class Order {

    total = 0;
    totalProdutos = 0;
    descontoValor = 0;
    produtos: Produto[];
    cliente: Cliente;

    constructor(cliente: Cliente) {
        this.cliente = cliente;
        this.produtos = [];
    }

    addProduto(produto: Produto) {
        if (this.produtoJaAdicionado(produto)) {
            throw new Error("Este item já foi incluido");
        }
        if (produto.quantidade < 0) {
            throw new Error("A quantidade do item não pode ser negativa");
        }
        this.produtos.push(produto);
        this.totalProdutos += (produto.preco * produto.quantidade);        
    }

    getTotal() {
        return this.totalProdutos - this.descontoValor;
    }

    aplicarCupomDesconto(cupom: CupomDesconto) {
        if (cupom.dataValidade.getTime() >= new Date().getTime()) {
            this.descontoValor = this.totalProdutos * (cupom.percentualDesconto/100);
        }
    }

    produtoJaAdicionado(produto: Produto) {
        for (const prod of this.produtos) {
            if (prod.descricao === produto.descricao) {
                return true;
            }
        }
        return false;
    }

    getTotalFrete() {
        let totalFrete = 0;        
        for (const produto of this.produtos) {
            const volume = ((produto.largura/100) * (produto.altura/100) * (produto.profundidade/100));
            const densidade = produto.peso / volume;
            const freteUnitario = 1000 * volume * (densidade/100);
            totalFrete += Math.max(freteUnitario, 10) * produto.quantidade;
        }
        return totalFrete;
    }

    getNumeroSerie() {
        return new Date().getFullYear;
    }

    getTotalProdutos () {
        
    }
}