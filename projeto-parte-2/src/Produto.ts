export default class Produto {
    descricao: string;
    quantidade: number;
    preco: number;
    largura: number;
    profundidade: number;
    altura: number;
    peso: number;
    constructor(descricao: string, quantidade: number, preco: number, altura?: number, largura?: number, profundidade?: number, peso?: number) {
        this.descricao = descricao;
        this.quantidade = quantidade;
        this.preco = preco;
        this.altura = altura || 0;
        this.largura = largura || 0;
        this.profundidade = profundidade || 0;
        this.peso = peso || 0;        
        if ((this.altura < 0) || (this.largura < 0) || (this.profundidade < 0)) {
            throw new Error("As dimenções do produto não podem ser negativas");
        }
        if (this.peso < 0) {
            throw new Error("O peso do item não pode ser negativo");            
        }
    }
}