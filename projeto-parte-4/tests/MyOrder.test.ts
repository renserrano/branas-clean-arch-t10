import Customer from "../src/domain/entity/Customer";
import Order from "../src/domain/entity/Order";
import Cpf from "../src/domain/entity/Cpf";
import MySqlAdapter from "../src/infra/database/MySqlAdapter";
import OrderRepositoryDatabase from "../src/infra/repository/OrderRepositoryDatabase";
import crypto from "crypto";
import Product from "../src/domain/entity/Product";
import Coupon from "../src/domain/entity/Coupon";
import FreightCalculator from "../src/domain/entity/FreightCalculator";
import CurrencyTable from "../src/domain/entity/CurrencyTable";

test("Deve criar um order com 3 produtos e calcular o total", function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")));
    order.addItem(new Product(1, "A", 20.0, 10, 10, 10, 10, "BRL"), 1);
    order.addItem(new Product(2, "B", 5.50, 10, 10, 10, 10, "BRL"), 2);
    order.addItem(new Product(3, "C", 12.0, 10, 10, 10, 10, "BRL"), 3);
    expect(order.getTotal()).toBe(67.0);
});

test("Deve criar um order com 3 produtos associar cupom de desconto e calcular o total (% sobre o order)", function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")));
    const coupon = new Coupon("cupom 10% de desconto", 10.0, new Date());
    order.addItem(new Product(1, "A", 36.0, 10, 10, 10, 10, "BRL"), 1);
    order.addItem(new Product(2, "B", 2.70, 10, 10, 10, 10, "BRL"), 3);
    order.addItem(new Product(3, "C", 9.30, 10, 10, 10, 10, "BRL"), 2);
    order.addCoupon(coupon);
    expect(order.getTotal()).toBe(56.43);
});

// precisa encapsular dentro de uma arrow function senão o erro acontece antes:
// test("Não deve criar um order com cpf inválido, lançar erro", function () {
//     const uuid = crypto.randomUUID();
//     expect(() => {new Order(uuid, new Customer("Renan", new Cpf("497.113.620-42")))}).toThrow(InvalidCpfException);
// });

test("Não deve aplicar cupom de desconto expirado", function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")));
    const coupon = new Coupon("cupom 10% de desconto", 10.0, new Date("2023-02-11T23:59:59"));
    order.addItem(new Product(1, "A", 36.0, 10, 10, 10, 10, "BRL"), 1);
    order.addItem(new Product(2, "B", 2.70, 10, 10, 10, 10, "BRL"), 3);
    order.addItem(new Product(3, "C", 9.30, 10, 10, 10, 10, "BRL"), 2);
    order.addCoupon(coupon);
    expect(order.getTotal()).toBe(62.7);
});

test("Ao fazer um order a quantidade do item não pode ser negativa", function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")));
    expect(() => { order.addItem(new Product(1, "A", 36.0, 10, 10, 10, 10, "BRL"), -1) }).toThrowError("Invalid quantity");
});

test("Ao fazer um order o mesmo item não pode ser inserido mais de uma vez", function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")));
    expect(() => { order.addItem(new Product(1, "A", 36.0, 10, 10, 10, 10, "BRL"), 1),
                   order.addItem(new Product(1, "A", 36.0, 10, 10, 10, 10, "BRL"), 2)
    }).toThrowError("Duplicated item");
});

test("Nenhuma dimensão do item pode ser negativa", function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")));
    expect(() => { order.addItem(new Product(1, "Produto 1", 1.0, 36.0, 20, -15, 10, "BRL"), 1)  }).toThrowError("Invalid dimension");
});

test("O peso do item não pode ser negativo", function () {
    const uuid = crypto.randomUUID();
    expect(() => {  const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")));
                    order.addItem(new Product(1, "A", 36.0, 10, 10, 10, -1, "BRL"), 1)
                    order.addItem(new Product(2, "B", 36.0, 10, 10, 10, 10, "BRL"), 1)
    }).toThrowError("Invalid dimension");
});

test("Deve calcular o valor do frete com base nas dimensões (altura, largura, profundidade em cm) e o peso dos produtos (em KG)", function () {   
    expect(FreightCalculator.calculate(new Product(1, "Guitarra", 30.0, 100, 30, 10, 3, "BRL"))).toBe(30);
});

test("Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado", function () {
    expect(FreightCalculator.calculate(new Product(1, "Camera", 130.00, 20, 15, 10, 1, "BRL"))).toBe(10);
});

test("Deve fazer um order salvando no banco de dados", async function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")));
    order.addItem(new Product(1, "Camera", 130.00, 20, 15, 10, 1, "BRL"), 1);    
    const repository = new OrderRepositoryDatabase(new MySqlAdapter());
    await repository.save(order);
    const orderGet = await repository.getById(uuid);
    expect(orderGet.idOrder).toBe(order.idOrder);
});

test("Deve gerar um número de série do order", function () {
    const uuid = crypto.randomUUID();
    const order = new Order(uuid, new Customer("Renan", new Cpf("497.703.620-42")), new CurrencyTable(), 1);
    expect(order.getCode()).toBe("202300000001");
});