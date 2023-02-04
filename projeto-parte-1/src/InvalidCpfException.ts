export default class InvalidCpfException extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'InvalidCpfException'
    }
  }