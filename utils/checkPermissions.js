import { UnAuthenticatedError } from "../errors/index.js";
const checkPermissions = (requestId, createdBy) => {
  if (requestId === createdBy.toString()) return;
  throw new UnAuthenticatedError(`not authorized`);
};

export default checkPermissions;
