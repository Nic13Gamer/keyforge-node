export class KeyforgeError extends Error {
  constructor(
    readonly message: string,
    readonly name: string,
    readonly status: number
  ) {
    super(message);
    this.name = name;
    this.status = status;
  }
}
