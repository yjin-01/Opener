export class NotExistException extends Error {
  private statusCode: number;

  private error: string;

  constructor(message) {
    super();
    this.statusCode = 404;
    this.message = message;
    this.error = 'Not Founded';
    Object.setPrototypeOf(this, NotExistException.prototype);
  }
}
