class InvalidCpfException extends Error {
    constructor(message) {
      super(message)
      this.name = 'InvalidCpfException'
    }
  }