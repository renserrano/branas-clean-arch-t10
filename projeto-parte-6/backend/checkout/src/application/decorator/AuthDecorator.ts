import AuthGateway from "../gateway/AuthGateway";
import Usecase from "../usecase/Usecase";

export default class AuthDecorator implements Usecase {

    constructor(
        readonly usecase: Usecase,
        readonly authGateway: AuthGateway
    ) {
    }

    async execute(input: any): Promise<any> {
        if (input && input.token) {
            try {
                const payload = await this.authGateway.verify(input.token);
                input.email = payload.email;
                return this.usecase.execute(input);
            } catch (e: any) {
                throw new Error("Auth error");
            }
        } else {
            return this.usecase.execute(input);
        }
    }
}