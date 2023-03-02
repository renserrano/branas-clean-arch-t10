import CLIHandler from "./CLIHandler";

const handler = new CLIHandler();
handler.on("set-cpf", function () {});
handler.on("add-item", function () {});
handler.on("checkout", function () {});

handler.type("set-cpf 407.302.170-27");
handler.type("add-item 1 1");
handler.type("checkout");