import { useAuth } from "../context/auth";
import { endpoints } from "../utils/constants";
import { Overlay } from "../components/Loading";
import AccountSecurity from "../components/account/AccountSecurity";
import AccountDetails from "../components/account/AccountDetails";
import AccountBilling from "../components/account/AccountBilling";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

const Account = () => {
  // Get auth state
  const { setAuthToken } = useAuth();

  // Fetch account data
  const [{ loading, data, error, msg }] = useApi(
    endpoints.account.get + "?unified=true"
  );

  if (loading) return <Overlay />;

  if (error) {
    return (
      <div className="container p--2">
        <Alerts messages={msg} type="danger" />
      </div>
    );
  }

  return (
    <div className="container p--y-1">
      <div className="flex">
        {data && (
          <>
            {/* Account Details */}
            <div className="flex--1-of-3">
              <AccountDetails accountData={data.data.user} />
            </div>

            {/* Account Billing */}
            <div className="flex--1-of-3">
              <h3 className="m--y-1">Account Billing</h3>
              <AccountBilling
                billingData={{
                  paymentMethod: data.data.paymentMethod,
                  subscription: data.data.subscription,
                  productPlan: data.data.user.productPlan,
                }}
              />
            </div>
            {/* Account Security */}
            <div className="flex--1-of-3">
              <h3 className="m--y-1">Account Security</h3>
              <AccountSecurity />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
