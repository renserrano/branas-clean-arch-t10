export default class CLIHandler {
    commands: any = {};

    on(command: string, callback: Function) {
        this.commands[command] = callback;
    }

    type(text: string) {
        const command = text.split(" ");
    }
}