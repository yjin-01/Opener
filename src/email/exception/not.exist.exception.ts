export class NotExistException extends Error {
  message: string;

  statusCode: number;

  error: string;

  constructor(error) {
    super();
    this.error = error;
    this.statusCode = 404;
    this.message = 'Not Found';

    Object.setPrototypeOf(this, NotExistException.prototype);
  }
}
