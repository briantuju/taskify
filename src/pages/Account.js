import { useAuth } from "../context/auth";
import { endpoints } from "../utils/constants";
import { Overlay } from "../components/Loading";
import Activate from "../components/account/Activate";
import useApi from "../hooks/useApi";

const Account = () => {
  // Get auth state
  const { setAuthToken } = useAuth();

  // Fetch account data
  const [{ loading, data, error, msg }] = useApi(
    endpoints.account.get + "?unified=true"
  );

  if (loading) return <Overlay />;

  return (
    <div className="container p--y-1">
      <h1>Welcome to your account page</h1>

      {data && !data.data.user.verification.isVerified && <Activate />}
    </div>
  );
};

export default Account;
