import { Link } from "react-router-dom";
import { pageUrls } from "../utils/constants";

const NotFound = () => {
  return (
    <div className="p--y-2 container">
      <div className="d--flex-center p--2 m--1 shadow--big">
        <h1 className="h1">Sorry, Nothing to see here!</h1>

        <p className="text--warn m--y-1">
          Try navigating to another page, or contact us if you think it's an
          error
        </p>

        <p className="p--y-2">
          <Link to={pageUrls.landing} className="btn btn--size-tiny">
            Return to homepage
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
