export class InvalidEmailException extends Error {
  private statusCode: number;

  private error: string;

  constructor(message) {
    super();
    this.statusCode = 400;
    this.message = message;
    this.error = 'Bad Request';
    Object.setPrototypeOf(this, InvalidEmailException.prototype);
  }
}
