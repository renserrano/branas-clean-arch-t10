export default class CupomDesconto {

    descricao: string;
    percentualDesconto: number;
    dataValidade: Date;

    constructor(descricao: string, percentualDesconto: number, dataValidade: Date) {
        this.descricao = descricao;
        this.percentualDesconto = percentualDesconto;
        this.dataValidade = dataValidade;
    }
}