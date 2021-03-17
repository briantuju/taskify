import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./context/auth";
import { pageUrls } from "./utils/constants";

/**
 * Implements the logic that makes sure only authenticated
 * users can access routes requiring authentication
 */
const AuthRoutes = ({ children, ...rest }) => {
  // The global auth context
  const { authToken } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authToken ? (
          children
        ) : (
          <Redirect
            to={{ pathname: pageUrls.login, state: { from: location } }}
          />
        )
      }
    />
  );
};

export default AuthRoutes;
