drop table if exists branas.produtos;
drop table if exists branas.pedidos;
drop table if exists branas.pedidos_produtos;

create table branas.produtos (
    id int AUTO_INCREMENT primary key,
    descricao varchar(40),
	preco decimal(12,2),
	altura decimal(12,2),
	largura decimal(12,2),
	profundidade decimal(12,2),
	peso decimal(12,2)
);

create table branas.pedidos (
    id int AUTO_INCREMENT primary key,
    serie varchar(12),
	datapedido DATE,
	valortotal decimal(12,2),
	valorprodutos decimal(12,2),
	valorfrete decimal(12,2),
	descontovalor decimal(12,2)
);

create table branas.pedidos_produtos (
    id int AUTO_INCREMENT primary key,
    idproduto int,
	quantidade decimal(12,2),
	valorunitario decimal(12,2),
	valortotal decimal(12,2),
	valorfrete decimal(12,2)
);