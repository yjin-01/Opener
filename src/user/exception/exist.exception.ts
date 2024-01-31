export class ExistException extends Error {
  constructor(error) {
    super(`error ${error}`);
  }
}
