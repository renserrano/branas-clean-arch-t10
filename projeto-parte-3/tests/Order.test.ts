import Cliente from "../src/Cliente";
import CupomDesconto from "../src/CupomDesconto";
import Order from "../src/Order";
import Produto from "../src/Produto";
import Cpf from "../src/Cpf";
import InvalidCpfException from "../src/InvalidCpfException";
import MySqlAdapter from "../src/MySqlAdapter";
import OrderGatewayDatabase from "../src/OrderGatewayDatabase";

test("Deve criar um order com 3 produtos e calcular o total", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    const item1 = new Produto(1, "Produto 1", 1.0, 20.0);
    const item2 = new Produto(2, "Produto 2", 2.0, 5.50);
    const item3 = new Produto(3, "Produto 3", 3.0, 12.0);
    order.addProduto(item1);
    order.addProduto(item2);
    order.addProduto(item3);
    expect(order.getTotal()).toBe(67.0);
});

test("Deve criar um order com 3 produtos associar cupom de desconto e calcular o total (% sobre o order)", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    const item1 = new Produto(1, "Produto 1", 1.0, 36.0);
    const item2 = new Produto(2, "Produto 2", 3.0, 2.70);
    const item3 = new Produto(3, "Produto 3", 2.0, 9.30);
    const cupomDesconto1 = new CupomDesconto("cupom 10% de desconto", 10.0, new Date());
    order.addProduto(item1);
    order.addProduto(item2);
    order.addProduto(item3);
    order.aplicarCupomDesconto(cupomDesconto1);
    expect(order.getTotal()).toBe(56.43);
});

// precisa encapsular dentro de uma arrow function senão o erro acontece antes:
test("Não deve criar um order com cpf inválido, lançar erro", function () {
    expect(() => {new Order(new Cliente("Renan", new Cpf("497.113.620-42")))}).toThrow(InvalidCpfException);
});

test("Não deve aplicar cupom de desconto expirado", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    const item1 = new Produto(1, "Produto 1", 1.0, 36.0);
    const item2 = new Produto(2, "Produto 2", 3.0, 2.70);
    const item3 = new Produto(3, "Produto 3", 2.0, 9.30);
    const cupomDesconto1 = new CupomDesconto("cupom 10% de desconto", 10.0, new Date("2023-02-11T23:59:59"));
    order.addProduto(item1);
    order.addProduto(item2);
    order.addProduto(item3);
    expect(order.getTotal()).toBe(62.7);
});

test("Ao fazer um order a quantidade do item não pode ser negativa", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    const item1 = new Produto(1, "Produto 1", -1.0, 36.0);
    expect(() => { order.addProduto(item1) }).toThrowError("A quantidade do item não pode ser negativa");
});

test("Ao fazer um order o mesmo item não pode ser inserido mais de uma vez", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    const item1 = new Produto(1, "Produto 1", 1.0, 36.0);
    const item2 = new Produto(2, "Produto 1", 2.0, 36.0);
    expect(() => { order.addProduto(item1),
                   order.addProduto(item2)
    }).toThrowError("Este item já foi incluido");
});

test("Nenhuma dimensão do item pode ser negativa", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    expect(() => { const item1 = new Produto(1, "Produto 1", 1.0, 36.0, 20, -15, 10)
                   order.addProduto(item1)  }).toThrowError("As dimenções do produto não podem ser negativas");
});

test("O peso do item não pode ser negativo", function () {
    expect(() => {  const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
                    const item1 = new Produto(1, "Produto 1", 1.0, 36.0, 20, 15, 10, -1);
                    const item2 = new Produto(2, "Produto 2", 2.0, 36.0);
                    order.addProduto(item1)
                    order.addProduto(item2)
    }).toThrowError("O peso do item não pode ser negativo");
});

test("Deve calcular o valor do frete com base nas dimensões (altura, largura, profundidade em cm) e o peso dos produtos (em KG)", function () {   
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    const item1 = new Produto(1, "Guitarra", 1.0, 30.0, 100, 30, 10, 3);  
    order.addProduto(item1);
    expect(order.getTotalFrete()).toBe(30);
});

test("Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    const item1 = new Produto(1, "Camera", 1.0, 130.00, 20, 15, 10, 1);  
    order.addProduto(item1);
    expect(order.getTotalFrete()).toBe(10);
});

test("Deve fazer um order salvando no banco de dados", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    const item1 = new Produto(1, "Camera", 1.0, 130.00, 20, 15, 10, 1);  
    order.addProduto(item1);    
    const ordergateway = new OrderGatewayDatabase(new MySqlAdapter());
    expect(ordergateway.save(order)).toBe(true);
});

test("Deve gerar um número de série do order", function () {
    const order = new Order(new Cliente("Renan", new Cpf("497.703.620-42")));
    expect(order.getNumeroSerie()).toBe(new Date().getFullYear);
});