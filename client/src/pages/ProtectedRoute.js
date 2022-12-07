import { Navigate } from "react-router-dom";
import { useAppContext } from "../components/context/appContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/landing" />;
  }
  return <div>{children}</div>;
};
export default ProtectedRoute;
