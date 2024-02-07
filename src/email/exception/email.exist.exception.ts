export class EmailExistException extends Error {
  message: string;

  statusCode: number;

  error: string;

  constructor(error) {
    super();
    this.error = error;
    this.statusCode = 400;
    this.message = 'Bad Request';

    Object.setPrototypeOf(this, EmailExistException.prototype);
  }
}
