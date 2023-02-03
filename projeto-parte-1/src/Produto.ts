export default class Produto {
    descricao: string;
    quantidade: number;
    preco: number;
    constructor(descricao: string, quantidade: number, preco: number) {
        this.descricao = descricao;
        this.quantidade = quantidade;
        this.preco = preco;
    }
}