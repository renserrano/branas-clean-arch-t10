import Cliente from "../../Cliente"
import CouponRepository from "../../CouponRepository"
import CouponRepositoryDatabase from "../../CouponRepositoryDatabase"
import CurrencyGateway from "../../CurrencyGateway"
import CurrencyGatewayHttp from "../../CurrencyGatewayHttp"
import CurrencyTable from "../../CurrencyTable"
import FreightCalculator from "../../FreightCalculator"
import OrderRepository from "../../OrderRepository"
import OrderRepositoryDatabase from "../../OrderRepositoryDatabase"
import ProductRepository from "../../ProductRepository"
import ProductRepositoryDatabase from "../../ProductRepositoryDatabase"
import Cpf from "../entity/Cpf"
import Item from "../entity/Item"
import Order from "../entity/Order"

export default class Checkout {

	constructor(
		readonly currencyGateway: CurrencyGateway = new CurrencyGatewayHttp(),
		readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
		readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
		readonly orderRepository: OrderRepository = new OrderRepositoryDatabase()
	) {

	}

	async execute(input: Input): Promise<Output> {
		const currencies = await this.currencyGateway.getCurrencies();
		const currencyTable = new CurrencyTable();
		currencyTable.addCurrency("USD", currencies.usd);
		const sequence = await this.orderRepository.count();
		const order = new Order(input.uuid, new Cliente("Passar nome aqui", new Cpf(input.cpf)), currencyTable, sequence, new Date())
		let freight = 0;
		if (input.items) {
			for (const item of input.items) {
				const productData = await this.productRepository.getProduct(item.idProduct);
				order.addItem(productData, item.quantity);
				const itemFreight = FreightCalculator.calculate(productData);
				freight += Math.max(itemFreight, 10) * item.quantity;
			}
		}
		if (input.coupon) {
			const couponData = await this.couponRepository.getCoupon(input.coupon);
			if (!couponData.isExpired()) {

			}
		}
		if (input.from && input.to) {
			order.freight = freight;
		}
		let total = order.getTotal();
		await this.orderRepository.save(order);
		return {
			total,
			freight
		};
	}
}

type Input = {
	uuid?: string,
	cpf: string,
	items: { idProduct: number, quantity: number, price?: number }[],
	coupon?: string,
	from?: string,
	to?: string
}

type Output = {
	total: number,
	freight: number
}