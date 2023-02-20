import Product from "../../domain/entity/Product";
import Cliente from "../../Cliente";
import Item from "./Item";
import CurrencyTable from "../../domain/entity/CurrencyTable";
import FreightCalculator from "../../domain/entity/FreightCalculator";
import Coupon from "../../domain/entity/Coupon";
import crypto from "crypto";

export default class Order {

    totalProdutos = 0;
    descontoValor = 0;
    freight = 0;
    coupon?: Coupon;
    readonly items: Item[];
    readonly code: string;

    constructor(readonly idOrder: string | undefined, readonly cliente: Cliente, readonly currencyTable: CurrencyTable = new CurrencyTable(), readonly sequence: number = 1, readonly date: Date = new Date()) {
        if (!idOrder) this.idOrder = crypto.randomUUID();
        this.cliente = cliente;
        this.items = [];
        this.code = `${date.getFullYear()}${new String(sequence).padStart(8, "0")}`;
    }

    addItem(product: Product, quantity: number) {
        if (quantity <= 0) throw new Error("Invalid quantity");
        if (this.items.some((item: Item) => item.idProduct === product.idProduct)) throw new Error("Duplicated item");
        this.items.push(new Item(product.idProduct, product.price, quantity, product.currency));
        this.totalProdutos += (product.price * quantity);
    }

    addCoupon(coupon: Coupon) {
        if (!coupon.isExpired(this.date)) this.coupon = coupon;
    }

    getTotal() {
        let total = 0;
        for (const item of this.items) {
            total += (item.price * item.quantity * this.currencyTable.getCurrency(item.currency));
        }
        if (this.coupon) {
            total -= this.coupon.calculateDiscount(total);
        }      
        total += this.freight;
        return total;
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