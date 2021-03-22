import { Link, Redirect } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { pageUrls } from "../utils/constants";
import { useAuth } from "../context/auth";
// import ProductCTA from "../components/product/ProductCTA";

const Landing = () => {
  // Get the auth token
  const { authToken } = useAuth();

  // Redirect to homepage if user is authenticated
  if (authToken) return <Redirect to={pageUrls.home} />;

  return (
    <>
      <section className="hero-section">
        <div className="hero-section__image">
          <div className="hero-section__content">
            {/* Hero title */}
            <h1 className="hero-section__title">A Modern Task Manager</h1>

            {/* Hero subtitle */}
            <p className="hero-section__subtitle">
              Experience a simple and modern way to manage your tasks. <br />
              Say goodbye to complexity.
            </p>

            {/* Hero button */}
            <Link to={pageUrls.signup} className="hero-section__btn-cta">
              Get Started
            </Link>

            <HashLink
              to={`${pageUrls.landing}#featured`}
              className="hero-section__btn-cta-small"
            >
              See more
            </HashLink>
          </div>
        </div>
      </section>

      <section className="featured-section" id="featured">
        <div className="container">
          <h2 className="h1-landing">Features</h2>

          <div className="flex">
            <div className="flex--1-of-3">
              <div className="card shadow m--y-2">
                <img src="/logo.png" alt="Featured" className="card__img" />

                <div className="card__body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Perspiciatis voluptates laboriosam ipsum, laborum officia
                  excepturi alias.
                </div>
              </div>
            </div>

            <div className="flex--1-of-3">
              <div className="card shadow m--y-2">
                <img src="/logo.png" alt="Featured" className="card__img" />

                <div className="card__body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Perspiciatis voluptates laboriosam ipsum, laborum officia
                  excepturi alias.
                </div>
              </div>
            </div>

            <div className="flex--1-of-3">
              <div className="card shadow m--y-2">
                <img src="/logo.png" alt="Featured" className="card__img" />

                <div className="card__body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Perspiciatis voluptates laboriosam ipsum, laborum officia
                  excepturi alias.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <ProductCTA /> */}
    </>
  );
};

export default Landing;
