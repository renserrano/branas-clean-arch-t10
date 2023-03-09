import DistanceCalculator from "../src/domain/entity/DistanceCalculator";
import Cep from "../src/domain/entity/Cep";

test("Deve calcular a distância entre duas coordenadas", function () {
    const to = new Cep("", -27.5945, -48.5477);
    const from = new Cep("", -22.9129, -43.2003);
    const distance = DistanceCalculator.calculate(from, to);
    expect(distance).toBe(748.2217780081631);
});

test("Deve calcular a distância entre dois CEPs", function () {
    const to = new Cep("", -27.5945, -48.5477);
    const from = new Cep("", -22.9129, -43.2003);
    const distance = DistanceCalculator.calculate(from, to);
    expect(distance).toBe(748.2217780081631);
});