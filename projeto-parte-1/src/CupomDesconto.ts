export default class CupomDesconto {

    descricao: string;
    percentualDesconto: number;

    constructor(descricao: string, percentualDesconto: number) {
        this.descricao = descricao;
        this.percentualDesconto = percentualDesconto;
    }
}