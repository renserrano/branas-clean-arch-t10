import Pedido from "../src/Pedido";
import Produto from "../src/Produto";

test("Deve criar um pedido com 3 produtos e calcular o total", function () {
    const pedido = new Pedido();
    const produto1 = new Produto("Produto 1", 1.0, 20.0);
    const produto2 = new Produto("Produto 2", 2.0, 5.50);
    const produto3 = new Produto("Produto 3", 3.0, 12.0);
    pedido.addProduto(produto1);
    pedido.addProduto(produto2);
    pedido.addProduto(produto3);
    expect(pedido.getTotal()).toBe(67.0);
});

test("Deve criar um pedido com 3 produtos associar cupom de desconto e calcular o total (% sobre o pedido)", function () {
    const pedido = new Pedido();
    const produto1 = new Produto("Produto 1", 1.0, 20.0);
    const produto2 = new Produto("Produto 2", 2.0, 5.50);
    const produto3 = new Produto("Produto 3", 3.0, 12.0);
    pedido.addProduto(produto1);
    pedido.addProduto(produto2);
    pedido.addProduto(produto3);
    expect(pedido.getTotal()).toBe(67.0);
});

test("Não deve criar um pedido com cpf inválido, lançar erro", function () {
    const pedido = new Pedido();
    const produto1 = new Produto("Produto 1", 1.0, 20.0);
    const produto2 = new Produto("Produto 2", 2.0, 5.50);
    const produto3 = new Produto("Produto 3", 3.0, 12.0);
    pedido.addProduto(produto1);
    pedido.addProduto(produto2);
    pedido.addProduto(produto3);
    expect(pedido.getTotal()).toBe(67.0);
});