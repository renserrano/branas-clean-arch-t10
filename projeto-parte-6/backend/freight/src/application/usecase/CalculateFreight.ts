import DistanceCalculator from "../../domain/entity/DistanceCalculator";
import FreightCalculator from "../../domain/entity/FreightCalculator";
import ZipcodeRepository from "../repository/ZipcodeRepository";

export default class CalculateFreight {

	constructor (readonly zipCodeRepository: ZipcodeRepository) {
	}

	async execute (input: Input): Promise<Output> {
		const output: Output = {
			freight: 0
		};
		let distance = 1000;
		if (input.from && input.to) {
			const from = await this.zipCodeRepository.get(input.from);
			const to = await this.zipCodeRepository.get(input.to);
			console.log(from, to);
			if (from && to) {
				distance = DistanceCalculator.calculate(from.coord, to.coord);
				console.log(distance);
			}
		}
		if (input.items) {
			for (const item of input.items) {
				const itemFreight = FreightCalculator.calculate(distance, item.width, item.height, item.length, item.weight, item.quantity);
				output.freight += itemFreight;
				console.log(output.freight);
			}
		}
		return output;
	}
}

type Input = {
	items: { width: number, height: number, length: number, weight: number, quantity: number }[],
	from?: string,
	to?: string
}

type Output = {
	freight: number
}