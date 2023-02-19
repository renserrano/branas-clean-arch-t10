import Product from "../../domain/entity/Product";
import Cliente from "../../Cliente";
import Item from "./Item";
import CurrencyTable from "../../CurrencyTable";
import FreightCalculator from "../../FreightCalculator";
import Coupon from "../../Coupon";
import crypto from "crypto";

export default class Order {

    total = 0;
    totalProdutos = 0;
    descontoValor = 0;
    readonly items: Item[];
    readonly code: string;

    constructor(readonly idOrder: string | undefined, readonly cliente: Cliente, readonly currencyTable: CurrencyTable = new CurrencyTable(), readonly sequence: number = 1, date: Date = new Date()) {
        if (!idOrder) this.idOrder = crypto.randomUUID();
        this.cliente = cliente;
        this.items = [];
        this.code = `${date.getFullYear()}${new String(sequence).padStart(8, "0")}`;
    }

    addItem(product: Product, quantity: number) {
        if (quantity <= 0) throw new Error("A quantidade do item não pode ser negativa");
        if (this.items.some((item: Item) => item.idProduct === product.idProduct)) throw new Error("Este item já foi incluido");
        this.items.push(new Item(product.idProduct, product.price, quantity, product.currency));
        this.totalProdutos += (product.price * quantity);        
    }

    getTotal() {
        let total = 0;
        for (const item of this.items) {
            total += (item.price * item.quantity * this.currencyTable.getCurrency(item.currency));
        }
        return total;
    }

    aplicarCupomDesconto(coupon: Coupon) {
        if (coupon.isExpired(new Date())) {
            this.descontoValor = this.totalProdutos * (coupon.percentage/100);
        }
    }

    getTotalFrete() {
        // let totalFrete = 0;        
        // for (const produto of this.items) {
        //     FreightCalculator.calculate()
        //     const volume = ((produto.largura/100) * (produto.altura/100) * (produto.profundidade/100));
        //     const densidade = produto.peso / volume;
        //     const freteUnitario = 1000 * volume * (densidade/100);
        //     totalFrete += Math.max(freteUnitario, 10) * produto.quantidade;
        //  }
        // return totalFrete;
        return 0;
    }

    getCode() {
        return this.code;
    }
}