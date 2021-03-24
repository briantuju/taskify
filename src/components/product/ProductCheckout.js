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

const CheckoutForm = ({ checkoutObj, handleCheckout }) => {
  // Component state (Form State)
  const [formState, setFormState] = useState({
    submitting: false,
    valid: false,
    errorMsg: null,
    checkoutComplete: false,
  });

  // Destructure data
  const { plan, customer, priceId } = checkoutObj;

  // Initialize stripe hook and stripe elements
  const stripe = useStripe();
  const elements = useElements();

  // Handle the checkout process
  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();
    setFormState({ ...formState, submitting: true, errorMsg: null });

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
      return setFormState({
        ...formState,
        submitting: false,
        errorMsg: error.message,
      });
    }

    // Call the checkout handler callback
    handleCheckout({
      paymentMethodId: paymentMethod.id,
      customerId: customer.id,
      priceId,
      setFormState,
    });
  };

  // Handle form element changes
  const handleElementChange = (event) => {
    setFormState({ ...formState, valid: event.complete });

    if (event.error !== undefined) {
      setFormState({ ...formState, errorMsg: event.error.message });
    }

    if (event.complete === true) {
      setFormState({ ...formState, errorMsg: null, valid: true });
    }
  };

  // If the upgrade was successfull, redirect to homepage
  if (formState.checkoutComplete === true) {
    return hardRedirectLocation(pageUrls.home);
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
        {formState.errorMsg && (
          <Alerts messages={formState.errorMsg} type="danger" />
        )}

        <Button
          type="submit"
          isLoading={formState.submitting}
          disabled={!formState.valid}
        >
          Upgrade Plan
        </Button>
      </form>

      {/* Upgrade failed */}
      {/* <div className="m--y-2 bg--light text--center p--2">
        <Alerts messages={["Plan Upgrade failed"]} type="danger" />
        <span className="d--block">You can try again after a few moments</span>
      </div> */}
    </>
  );
};

const ProductCheckout = ({ checkoutObj }) => {
  // Create a subscription for this customer
  const createSubscription = async (data) => {
    // Destructure data
    const { paymentMethodId, customerId, priceId } = data;

    // Api call to create a subscription
    const { data: response, failed, msg } = await fetchData(
      endpoints.stripe.subscriptions,
      { paymentMethodId, customerId, priceId },
      "POST"
    );

    return { response, failed, msg };
  };

  // Upgrade the customer's current plan
  const upgradeCustomerPlan = async (data) => {
    // Store the necessary stripe data on the database
    const { failed, msg } = await fetchData(
      endpoints.account.upgradeAcc,
      data,
      "POST"
    );
    return { failed, msg };
  };

  // Create a subscription for this customer
  const completeCheckout = async (data) => {
    const { setFormState } = data;

    /* 
      If an error occurs when creating a subscription 
      we update the state of the CheckoutFrom component (setFormState) 
      to reflect this error.
    */
    const { failed, msg, response } = await createSubscription(data);

    // Upgrade failed
    if (failed) {
      return setFormState((formState) => ({
        ...formState,
        submitting: false,
        errorMsg: msg,
      }));
    }

    // Verify if the subscriptions' status is active
    if (response.data.status === "active") {
      const startDate = `${response.data.start_date}000`;

      // Payment was successful. Grant access to your service
      const { failed, msg } = await upgradeCustomerPlan({
        customerId: response.data.latest_invoice.customer,
        productId: response.data.items.data[0].price.product,
        subscriptionId: response.data.items.data[0].subscription,
        subscriptionStatus: response.data.status,
        subscriptionStartDate: new Date(parseInt(startDate)).toISOString(),
        productName: checkoutObj.plan,
        productPrice: response.data.items.data[0].price.unit_amount,
      });

      // Upgrade failed
      if (failed) {
        setFormState((formState) => ({
          ...formState,
          submitting: false,
          errorMsg: msg,
        }));
        return;
      }

      // Upgrade success
      return setFormState((formState) => ({
        ...formState,
        submitting: false,
        checkoutComplete: true,
      }));
    }

    // Subscription created, but user's plan not upgraded
    return setFormState((formState) => ({
      ...formState,
      submitting: false,
      errorMsg: "We could not upgrade your plan. Try again later!",
    }));
  };

  return (
    <div className="container p--y-2">
      <Elements stripe={checkoutObj.stripePromise}>
        <CheckoutForm
          checkoutObj={checkoutObj}
          handleCheckout={completeCheckout}
        />
      </Elements>
    </div>
  );
};

export default ProductCheckout;
