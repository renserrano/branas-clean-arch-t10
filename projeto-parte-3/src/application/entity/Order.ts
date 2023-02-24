import Product from "../../domain/entity/Product";
import Customer from "../../Customer";
import Item from "./Item";
import CurrencyTable from "../../domain/entity/CurrencyTable";
import Coupon from "../../domain/entity/Coupon";
import crypto from "crypto";

export default class Order {

    totalProdutos = 0;
    descontoValor = 0;
    freight = 0;
    coupon?: Coupon;
    readonly items: Item[];
    readonly code: string;

    constructor(readonly idOrder: string | undefined, readonly customer: Customer, readonly currencyTable: CurrencyTable = new CurrencyTable(), readonly sequence: number = 1, readonly date: Date = new Date()) {
        if (!idOrder) this.idOrder = crypto.randomUUID();
        this.customer = customer;
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
            //console.log(total);
        }
        if (this.coupon) {
            total -= this.coupon.calculateDiscount(total);
        }      
        total += this.freight;
        return total;
    }

    getCode() {
        return this.code;
    }
}