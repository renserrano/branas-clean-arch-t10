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
    const cupomDesconto1 = new CupomDesconto("cupom 10% de desconto", 10.0, new Date());
    pedido.addProduto(produto1);
    pedido.addProduto(produto2);
    pedido.addProduto(produto3);
    pedido.aplicarCupomDesconto(cupomDesconto1);
    expect(pedido.getTotal()).toBe(56.43);
});

// precisa encapsular dentro de uma arrow function senão o erro acontece antes:
test("Não deve criar um pedido com cpf inválido, lançar erro", function () {
    expect(() => {new Pedido(new Cliente("Renan", new Cpf("497.113.620-42")))}).toThrow(InvalidCpfException);
});

test("Não deve aplicar cupom de desconto expirado", function () {
    const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
    const produto1 = new Produto("Produto 1", 1.0, 36.0);
    const produto2 = new Produto("Produto 2", 3.0, 2.70);
    const produto3 = new Produto("Produto 3", 2.0, 9.30);
    const cupomDesconto1 = new CupomDesconto("cupom 10% de desconto", 10.0, new Date("2023-02-11T23:59:59"));
    pedido.addProduto(produto1);
    pedido.addProduto(produto2);
    pedido.addProduto(produto3);
    expect(pedido.getTotal()).toBe(62.7);
});

test("Ao fazer um pedido a quantidade do item não pode ser negativa", function () {
    const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
    const produto1 = new Produto("Produto 1", -1.0, 36.0);
    expect(() => { pedido.addProduto(produto1) }).toThrowError("A quantidade do item não pode ser negativa");
});

test("Ao fazer um pedido o mesmo item não pode ser inserido mais de uma vez", function () {
    const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
    const produto1 = new Produto("Produto 1", 1.0, 36.0);
    const produto2 = new Produto("Produto 1", 2.0, 36.0);
    expect(() => { pedido.addProduto(produto1),
                   pedido.addProduto(produto2)
    }).toThrowError("Este item já foi incluido");
});

test("Nenhuma dimensão do item pode ser negativa", function () {
    const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
    expect(() => { const produto1 = new Produto("Produto 1", 1.0, 36.0, 20, -15, 10)
                   pedido.addProduto(produto1)  }).toThrowError("As dimenções do produto não podem ser negativas");
});

test("O peso do item não pode ser negativo", function () {
    expect(() => {  const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
                    const produto1 = new Produto("Produto 1", 1.0, 36.0, 20, 15, 10, -1);
                    const produto2 = new Produto("Produto 2", 2.0, 36.0);
                    pedido.addProduto(produto1)
                    pedido.addProduto(produto2)
    }).toThrowError("O peso do item não pode ser negativo");
});

test("Deve calcular o valor do frete com base nas dimensões (altura, largura, profundidade em cm) e o peso dos produtos (em KG)", function () {   
    const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
    const produto1 = new Produto("Guitarra", 1.0, 30.0, 100, 30, 10, 3);  
    pedido.addProduto(produto1);
    expect(pedido.getTotalFrete()).toBe(30);
});

test("Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado", function () {
    const pedido = new Pedido(new Cliente("Renan", new Cpf("497.703.620-42")));
    const produto1 = new Produto("Camera", 1.0, 130.00, 20, 15, 10, 1);  
    pedido.addProduto(produto1);
    console.log(pedido.getTotalFrete());
    expect(pedido.getTotalFrete()).toBe(10);
});