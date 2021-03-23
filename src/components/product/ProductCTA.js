import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { pageUrls } from "../../utils/constants";

const ProductCTA = ({ CTAText = "Get Started" }) => {
  // Get auth token
  const { authToken } = useAuth();

  // Show this component to unauthenticated users only
  if (authToken) return null;

  return (
    <section className="cta-landing-section">
      <div className="container">
        <h2 className="h1-landing">Ready to join us</h2>

        <div className="cta-landing-section__banner d--flex-center text--center">
          <p className="m--y-1">
            The features listed above are just a sneap peak of what's to come.
            <br />
            Join us today and experince a boost in your productivity.
          </p>

          <Link to={pageUrls.signup} className="btn btn--size-big">
            {CTAText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCTA;
