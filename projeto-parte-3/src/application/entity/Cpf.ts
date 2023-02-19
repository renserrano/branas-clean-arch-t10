import InvalidCpfException from "../../InvalidCpfException";

export default class Cpf {

    cpf: string;

    removerPontuacoes(str: string) {
        return str
            .replace('.', '')
            .replace('.', '')
            .replace('-', '')
            .replace(" ", "");
    }

    valida(str: string) {
        if (str == null) {
            throw new InvalidCpfException(str);
        }
        if (str == undefined) {
            throw new InvalidCpfException(str);
        }
        if ((str.length < 11) || (this.cpf.length > 14)) {
            throw new InvalidCpfException(str); // if (str.length >= 11 || str.length <= 14){
        }

        str = this.removerPontuacoes(str);

        if (str.split("").every(c => c === str[0])) {
            throw new InvalidCpfException(str);
        }

        try {
            let d1, d2;
            let dg1, dg2, rest;
            let digito;
            let nDigResult;
            d1 = d2 = 0;
            dg1 = dg2 = rest = 0;

            for (let nCount = 1; nCount < str.length - 1; nCount++) {
                digito = parseInt(str.substring(nCount - 1, nCount));
                d1 = d1 + (11 - nCount) * digito;
                d2 = d2 + (12 - nCount) * digito;
            };

            rest = (d1 % 11);

            dg1 = (rest < 2) ? dg1 = 0 : 11 - rest;
            d2 += 2 * dg1;
            rest = (d2 % 11);

            if (rest < 2)
                dg2 = 0;
            else
                dg2 = 11 - rest;

            let nDigVerific = str.substring(str.length - 2, str.length);
            nDigResult = "" + dg1 + "" + dg2;
            if (nDigVerific != nDigResult) {
                throw new InvalidCpfException("Validação falhou");
            };
        } catch (e: any) {
            throw new InvalidCpfException(e.message);
        }
    }

    constructor(cpf: string) {
        this.cpf = cpf;
        this.valida(cpf);
    }
}