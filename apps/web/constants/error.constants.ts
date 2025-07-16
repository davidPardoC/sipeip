export class UnauthorizedException extends Error {
  statusCode: number;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedException";
    this.statusCode = 401;
  }
}
