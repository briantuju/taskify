import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Link, Redirect, useLocation } from "react-router-dom";
import { fetchData } from "../utils/api";
import { useAuth } from "../context/auth";
import { Alert } from "../components/Alerts";
import { Overlay } from "../components/Loading";
import { api, endpoints, pageUrls } from "../utils/constants";
import useQueryParams from "../hooks/useQueryParams";
import ProductPlanList from "../components/product/ProductPlanList";
import ProductCheckout from "../components/product/ProductCheckout";
import ProductCTA from "../components/product/ProductCTA";
import Button from "../components/formik/Button";
import useApi from "../hooks/useApi";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(api.keys.stripePublishableKey);

const PlansContainer = () => {
  // Get the auth status
  const { authToken } = useAuth();

  // Fetch api data
  const [{ error, loading, data }] = useApi(endpoints.stripe.fetch);

  return (
    <div className="p--y-2 container">
      <h1 className="h1">Product Plans</h1>

      {error && <Alert messages={error} type="danger" />}

      {loading && <Overlay />}

      {data && data.data.length > 0 ? (
        <ProductPlanList authToken={authToken} productPlanData={data.data} />
      ) : (
        data &&
        data.data.length === 0 && (
          <p className="shadow p--1 text--info">No Plans Available</p>
        )
      )}

      <ProductCTA CTAText="Signup Today" />
    </div>
  );
};

const UpgradePlan = ({ productId, plan }) => {
  // Get the auth status, location object and query params
  const { authToken } = useAuth();
  const location = useLocation();
  const query = useQueryParams();

  // Setup the component state
  const [state, setState] = useState({
    error: false,
    loading: false,
    errorMsg: "An error occured. Try again later!",
  });

  const [stripeObj, setStripeObj] = useState({
    showCheckout: false,
    customerObj: null,
    isCurrentPlan: false,
    priceId: null,
  });

  // Get account data
  const getAccountData = async () => {
    // Fetch api data
    const { data, failed, msg } = await fetchData(endpoints.account.get);
    if (failed) return null;

    return { data: data.data, failed, msg };
  };

  // Create customer
  const createCustomer = async (email) => {
    // Create the customer if he/she is a new customer
    const { data: stripeCustomer, failed, msg } = await fetchData(
      endpoints.stripe.customers,
      { email },
      "POST"
    );

    return { stripeCustomer, failed, msg };
  };

  // Get customer
  const getCustomer = async () => {
    setState({ ...state, loading: true });

    // Get the user account data
    const { data } = await getAccountData();

    if (data) {
      const userEmail = data.email;

      // Get the customer with this email from stripe customers
      const { data: existingCustomer, failed } = await fetchData(
        endpoints.stripe.customers + "?email=" + userEmail
      );

      if (failed) {
        setState({ ...state, loading: false, error: true });
        return null;
      }

      setState({ ...state, loading: false });
      return {
        data: existingCustomer.data ? { ...existingCustomer.data } : null,
        productPlan: data.productPlan,
        userEmail,
      };
    }

    setState({ ...state, loading: false, error: true });
    return null;
  };

  // Handle product plan upgrade
  const upgradeUserPlan = async () => {
    let thisCustomer;

    const existingCustomer = await getCustomer();

    if (!existingCustomer) {
      setState({ ...state, errorMsg: "Customer not found", error: true });
      return;
    }

    // This customer is already subscribed to this plan
    if (existingCustomer.productPlan.id === productId) {
      return setStripeObj((stripeObj) => ({
        ...stripeObj,
        isCurrentPlan: true,
      }));
    }

    // This is a new customer
    if (existingCustomer.data === null) {
      setState({ ...state, loading: true });

      // Create the customer if he/she is a new customer
      const { stripeCustomer, failed, msg } = await createCustomer(
        existingCustomer.userEmail
      );

      if (failed) {
        setState({ ...state, loading: false, errorMsg: msg, error: true });
        return;
      }

      thisCustomer = stripeCustomer.data;
      setState({ ...state, loading: false });
    }

    // This customer may wish to change current plan
    thisCustomer = existingCustomer.data;

    // Update component state
    return setStripeObj((stripeObj) => ({
      ...stripeObj,
      showCheckout: true,
      customerObj: thisCustomer,
      priceId: query.get("price_id") || null,
    }));
  };

  // Redirect to login if user is not authenticated
  if (!authToken) {
    return (
      <Redirect to={{ pathname: pageUrls.login, state: { from: location } }} />
    );
  }

  // Display checkout
  if (stripeObj.showCheckout === true && stripeObj.priceId) {
    return (
      <ProductCheckout
        checkoutObj={{
          stripePromise,
          plan,
          customer: stripeObj.customerObj,
          priceId: stripeObj.priceId,
        }}
      />
    );
  }

  // Handle malformed urls
  if (!query.get("price_id")) return <Redirect to={pageUrls.productPlans} />;

  return (
    <div className="container p--y-2">
      {/* Show messages/errors */}
      {state.error && <Alert messages={state.errorMsg} type="danger" />}

      <div className="d--flex-center shadow p--2 m--y-2">
        <span className="d--block m--y-1">
          You have selected <strong className="text--info">{plan}</strong>
        </span>

        <h3 className="m--y-1 text--center">
          When you upgrade to a paid plan, you will get all the free features in
          addition to the features that are included in `{plan}`.
        </h3>

        {/* Notify customer of existing plan */}
        {stripeObj.isCurrentPlan ? (
          <span className="d--block m--y-1 text--danger">
            You are currently subscribed to this plan
          </span>
        ) : (
          <Button
            variant="white"
            className="shadow"
            isLoading={state.loading}
            disabled={stripeObj.isCurrentPlan}
            onClick={upgradeUserPlan}
          >
            Upgrade to {plan}
          </Button>
        )}

        <p className="d--block m--y-1">
          <Link to={pageUrls.productPlans} className="link--info">
            See other plans
          </Link>
        </p>
      </div>
    </div>
  );
};

const ProductPlans = () => {
  // Get selectedPlan from Query
  const query = useQueryParams();
  const selectedPlan = query.get("selectedPlan");
  const productId = query.get("prod_id");

  // Check if there's a selected plan and handle appropriately
  if (selectedPlan) {
    return <UpgradePlan productId={productId} plan={selectedPlan} />;
  }

  return <PlansContainer />;
};

export default ProductPlans;
