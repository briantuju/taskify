import { scriptUrls } from "../utils/constants";
import useScript from "../hooks/useScript";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  useScript(scriptUrls.ioniconsUrl);

  return (
    <>
      {/* Application header */}
      <Header />

      {/* Main content */}
      <main id="main" className="main-content">
        {children}
      </main>

      {/* Application footer */}
      <Footer />
    </>
  );
};

export default Layout;
