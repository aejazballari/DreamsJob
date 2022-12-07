import CustumAPIError from "./customAPIError.js";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes.js";

class NotFoundError extends CustumAPIError {
  constructor(message) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
