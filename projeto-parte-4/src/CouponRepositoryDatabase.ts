import Coupon from "./domain/entity/Coupon";
import CouponRepository from "./CouponRepository";
import MySqlAdapter from "./MySqlAdapter";
import Connection from "./Connection";

export default class CouponRepositoryDatabase implements CouponRepository {

    constructor(readonly connection: Connection = new MySqlAdapter()) {
    }

    async getCoupon(code: string): Promise<Coupon> {
        const [couponData] = await this.connection.query("select * from cccat10.coupon where code = ?", [code]);
        return new Coupon(couponData.code, parseFloat(couponData.percentage), couponData.expire_date);
    }
}