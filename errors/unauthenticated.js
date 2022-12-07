import CustumAPIError from "./customAPIError.js";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes.js";

class UnAuthenticatedError extends CustumAPIError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthenticatedError;
