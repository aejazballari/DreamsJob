import CustumAPIError from "./customAPIError.js";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes.js";

class BadRequestError extends CustumAPIError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
