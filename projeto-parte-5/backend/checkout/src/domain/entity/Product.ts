export default class Product {
    constructor(readonly idProduct: number, readonly description: string, readonly price: number, readonly height: number, readonly width: number, readonly length: number, readonly weight: number, readonly currency: string) {
        if ((this.height < 0) || (this.width < 0) || (this.length < 0) || (this.weight <= 0)) {
            throw new Error("Invalid dimension");
        }
    }
    getVolume() {
        return this.width / 100 * this.height / 100 * this.length / 100;
    }
}