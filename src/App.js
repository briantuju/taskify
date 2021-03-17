import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { pageUrls } from "./utils/constants";
import { AuthContext } from "./context/auth";
import Layout from "./components/Layout";
import AuthRoutes from "./AuthRoutes";
import * as pages from "./pages";
import "./App.css";
import { AppStorage } from "./utils/helpers";

function App() {
  // Get token and save to state
  const token = AppStorage.getAuthToken();
  const [authToken, setAuthToken] = useState(token);

  // Save the token
  const setTokens = (token) => {
    // Save token to Storage
    AppStorage.setJwtToken(token);

    // Save token to state
    setAuthToken(token);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken: setTokens }}>
      <Layout>
        <Switch>
          <Route exact path={pageUrls.landing}>
            <pages.Landing />
          </Route>

          <Route path={pageUrls.signup}>
            <pages.Signup />
          </Route>

          <Route path={pageUrls.login}>
            <pages.Login />
          </Route>

          <Route path={pageUrls.activateAccount}>
            <pages.ActivateAccount />
          </Route>

          <Route path={pageUrls.forgotPassword}>
            <pages.ForgotPassword />
          </Route>

          <Route path={pageUrls.resetPassword}>
            <pages.ResetPassword />
          </Route>

          <Route path={pageUrls.productPlans}>
            <pages.ProductPlans />
          </Route>

          <AuthRoutes path={pageUrls.account}>
            <pages.Account />
          </AuthRoutes>

          <AuthRoutes path={pageUrls.home}>
            <pages.Home />
          </AuthRoutes>

          <AuthRoutes path={`${pageUrls.board}/:id`}>
            <pages.Board />
          </AuthRoutes>

          <AuthRoutes path={`${pageUrls.task}/:id`}>
            <pages.Task />
          </AuthRoutes>

          <Route path={pageUrls.notFound}>
            <pages.NotFound />
          </Route>
        </Switch>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;
