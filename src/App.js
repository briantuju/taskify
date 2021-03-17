import { Route, Switch } from "react-router-dom";
import { pageUrls } from "./utils/constants";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path={pageUrls.landing}>
          <Landing />
        </Route>

        <Route path={pageUrls.notFound}>
          <NotFound />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
