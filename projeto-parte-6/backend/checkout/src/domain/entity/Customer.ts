import Cpf from "./Cpf";

export default class Customer {

    name: string;
    cpf: Cpf;

    constructor(name: string, cpf: Cpf) {
        this.name = name;
        this.cpf = cpf;
    }
}