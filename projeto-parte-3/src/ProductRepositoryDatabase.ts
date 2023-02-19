import Product from "./domain/entity/Product";
import ProductRepository from "./ProductRepository";
import Connection from "./Connection";
import MySqlAdapter from "./MySqlAdapter";

export default class ProductRepositoryDatabase implements ProductRepository {
    
    constructor(readonly connection: Connection = new MySqlAdapter()) {
    }

    async getProduct(idProduct: number): Promise<Product> {
        const [productData] = await this.connection.query("select * from cccat10.product where id_product = ?", [idProduct]);
        return new Product(productData.id_product, productData.description, parseFloat(productData.price), productData.width, productData.height, productData.length, parseFloat(productData.weight), productData.currency);
    }
}