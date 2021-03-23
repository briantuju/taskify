import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { fetchData } from "../../utils/api";
import { pageUrls, endpoints } from "../../utils/constants";
import { hardRedirectLocation } from "../../utils/helpers";
import Button from "../formik/Button";
import Alerts from "../Alerts";

const CheckoutForm = ({
  checkoutObj,
  upgradeObj,
  createSubscription,
  loading,
  error,
}) => {
  // Component state (Form State)
  const [formState, setFormState] = useState({
    submitting: false,
    error: null,
    complete: false,
  });

  // Destructure data
  const { plan, customer, priceId } = checkoutObj;
  const { success, fail } = upgradeObj;

  // Initialize stripe hook and stripe elements
  const stripe = useStripe();
  const elements = useElements();

  // Handle the checkout process
  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();
    setFormState({ ...formState, submitting: true, error: null });

    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        email: customer.email,
        name: customer.name || null,
        phone: customer.phone || null,
      },
      metadata: customer.metadata || null,
    });

    // Update state after creating payment method
    if (error) {
      setFormState({ ...formState, submitting: false, error: error.message });
    }

    // Call the create subscription callback method
    createSubscription({
      paymentMethodId: paymentMethod.id,
      customerId: customer.id,
      priceId,
      setFormState,
    });
  };

  // Handle form element changes
  const handleElementChange = (event) => {
    setFormState({ ...formState, complete: event.complete });

    if (event.error !== undefined) {
      setFormState({ ...formState, error: event.error.message });
    }

    if (event.complete === true) {
      setFormState({ ...formState, error: null, complete: true });
    }
  };

  // If the upgrade was successfull, redirect to homepage
  if (success === true) {
    setTimeout(() => hardRedirectLocation(pageUrls.home), 3000);
  }

  return (
    <>
      <div className="text--center bg--light m--y-2 p--1 brad">
        <h3 className="h3">
          You are about to upgrade to <strong>{plan}</strong>
        </h3>

        <Link to={pageUrls.productPlans} className="link--info">
          See other plans
        </Link>
      </div>

      {/* Only show the form if upgrade has not failed */}
      {success ? (
        // Upgrade Successfull
        <div className="text--center text--white bg--success-dark m--y-2 p--2 shadow brad h3">
          Your upgrade was successful. <br />
          You will be redirected in a few seconds
        </div>
      ) : !fail ? (
        <>
          <form
            className="form form--shadow form--center "
            onSubmit={handleCheckoutSubmit}
          >
            <h3 className="form__title">Enter Payment information</h3>

            <CardElement
              className="d--block m--y-2 bg--light p--2 brad--tiny"
              onChange={handleElementChange}
            />

            {/* Display form errors */}
            {(formState.error || error) && (
              <Alerts
                messages={`${
                  formState.error
                    ? [formState.error]
                    : "An erro occurred. Try again later!"
                }`}
                type="danger"
              />
            )}

            <Button
              type="submit"
              isLoading={formState.submitting || loading}
              disabled={!formState.complete}
            >
              Upgrade Plan
            </Button>
          </form>
        </>
      ) : (
        // Upgrade failed
        <div className="m--y-2 bg--light text--center p--2">
          <Alerts messages={["Plan Upgrade failed"]} type="danger" />
          <span className="d--block">
            You can try again after a few moments
          </span>
        </div>
      )}
    </>
  );
};

const ProductCheckout = ({ checkoutObj }) => {
  // Component state
  const [state, setState] = useState({
    success: false,
    fail: false,
    loading: false,
    error: false,
  });

  // Upgrade the customer plan
  const upgradeCustomerPlan = async (data) => {
    setState({ ...state, loading: true });

    // Store the necessary stripe data on the database
    const { failed } = await fetchData(
      endpoints.account.upgradeAcc,
      data,
      "POST"
    );
    setState({ ...state, loading: false, error: failed });
  };

  // Create a subscription for this customer
  const createSubscriptionCb = async (data) => {
    // Destructure data
    const { paymentMethodId, customerId, priceId, setFormState } = data;

    setState({ ...state, loading: true });

    // Api call to create customer subscription
    const { data: response, failed } = await fetchData(
      endpoints.stripe.subscriptions,
      { paymentMethodId, customerId, priceId },
      "POST"
    );

    setState({ ...state, loading: false, error: failed });
    setFormState((formState) => ({ ...formState, submitting: false }));

    // 1. Verify the subscription status is active
    if (response.data.status === "active") {
      const startDate = `${response.data.start_date}000`;

      // Payment was successful. Grant access to your service
      await upgradeCustomerPlan({
        customerId: response.data.latest_invoice.customer,
        productId: response.data.items.data[0].price.product,
        subscriptionId: response.data.items.data[0].subscription,
        subscriptionStatus: response.data.status,
        subscriptionStartDate: new Date(parseInt(startDate)).toISOString(),
        productName: checkoutObj.plan,
        productPrice: response.data.items.data[0].price.unit_amount,
      });

      setState({ ...state, success: true });
    } else {
      setState({ ...state, fail: true });
    }
  };

  return (
    <div className="container p--y-2">
      <Elements stripe={checkoutObj.stripePromise}>
        <CheckoutForm
          checkoutObj={checkoutObj}
          upgradeObj={state}
          createSubscription={createSubscriptionCb}
          loading={state.loading}
          error={state.error}
        />
      </Elements>
    </div>
  );
};

export default ProductCheckout;
