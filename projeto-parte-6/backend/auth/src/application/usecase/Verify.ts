import TokenGenerator from "../../domain/entity/TokenGenerator";

// use case
export default class Verify {

    constructor() {
    }

    async execute(token: string): Promise<any> {
        const tokenGenerator = new TokenGenerator("key");
        return tokenGenerator.verify(token);
    }
}