import Cpf from "./application/entity/Cpf";

export default class Cliente {

    nome: string;
    cpf: Cpf;

    constructor(nome: string, cpf: Cpf) {
        this.nome = nome;
        this.cpf = cpf;
    }
}