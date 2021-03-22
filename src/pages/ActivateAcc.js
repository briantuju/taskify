import { useEffect } from "react";
import { useAuth } from "../context/auth";
import { Spinner } from "../components/Loading";
import { endpoints, pageUrls } from "../utils/constants";
import { hardRedirectLocation } from "../utils/helpers";
import useQueryParams from "../hooks/useQueryParams";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

const ActivateAcc = () => {
  // Get the query params
  const query = useQueryParams();
  const token = query.get("token") || "";

  // Auth state
  const { setAuthToken } = useAuth();

  // Fetch API data
  const [{ loading, error, data, msg }] = useApi(
    `${endpoints.account.activateAcc}?token=${token}`
  );

  // Update auth state after data fetch
  useEffect(() => {
    let timer;
    if (data && data.data) setAuthToken(data.data.authToken);

    // Redirect after successfull account activation
    if (data && data.success) {
      timer = setTimeout(() => hardRedirectLocation(pageUrls.home), 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [data, setAuthToken]);

  return (
    <div className="container p--y-2 text--center">
      {loading && (
        <div className="m--2 d--flex-center">
          <Spinner />
        </div>
      )}

      {error && (
        <>
          <p className="m--y-2">
            An error occured. We could not complete your account verification at
            this moment. Please try again later.
          </p>
          <Alerts messages={msg || "An error occured"} type="danger" />
        </>
      )}

      {data && data.success && (
        <div className="p--2 m--2">
          <h1 className="h3 m--y-2 text--success">Account Verified</h1>
          <p className="m--y-2 text--info">Redirecting in a few seconds</p>
        </div>
      )}
    </div>
  );
};

export default ActivateAcc;
