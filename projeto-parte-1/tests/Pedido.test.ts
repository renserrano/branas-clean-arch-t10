import Cliente from "../src/Cliente";
import CupomDesconto from "../src/CupomDesconto";
import Pedido from "../src/Pedido";
import Produto from "../src/Produto";
import Cpf from "../src/Cpf";
import InvalidCpfException from "../src/InvalidCpfException";

test("Deve criar um pedido com 3 produtos e calcular o total", function () {
    const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
    const produto1 = new Produto("Produto 1", 1.0, 20.0);
    const produto2 = new Produto("Produto 2", 2.0, 5.50);
    const produto3 = new Produto("Produto 3", 3.0, 12.0);
    pedido.addProduto(produto1);
    pedido.addProduto(produto2);
    pedido.addProduto(produto3);
    expect(pedido.getTotal()).toBe(67.0);
});

test("Deve criar um pedido com 3 produtos associar cupom de desconto e calcular o total (% sobre o pedido)", function () {
    const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
    const produto1 = new Produto("Produto 1", 1.0, 36.0);
    const produto2 = new Produto("Produto 2", 3.0, 2.70);
    const produto3 = new Produto("Produto 3", 2.0, 9.30);
    const cupomDesconto1 = new CupomDesconto("cupom 10% de desconto", 10.0);
    pedido.addProduto(produto1);
    pedido.addProduto(produto2);
    pedido.addProduto(produto3);
    pedido.aplicarCupomDesconto(cupomDesconto1);
    expect(pedido.getTotal()).toBe(56.43);
});

test("Não deve criar um pedido com cpf inválido, lançar erro", function () {
    expect(() => {new Pedido(new Cliente("Renan", new Cpf("497.113.620-42")))}).toThrow(InvalidCpfException);
});