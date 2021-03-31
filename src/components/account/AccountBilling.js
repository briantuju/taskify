import { useState } from "react";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { Alert } from "../Alerts";
import { fetchData } from "../../utils/api";
import { hardRedirectLocation } from "../../utils/helpers";
import { endpoints, pageUrls } from "../../utils/constants";
import Button from "../formik/Button";

/**
 * Cancel the customer's current subscription
 * @param {String} subscriptionId
 * @param {Function} setState
 */
const cancelPlan = async (subscriptionId, setState) => {
  setState((state) => ({ ...state, error: false }));

  // Api call to cancel current plan
  if (window.confirm("Cancel current plan?")) {
    const { failed, msg } = await fetchData(
      endpoints.stripe.subscriptions,
      { subscriptionId },
      "DELETE"
    );

    // Redirect to account page after deleting subscription
    if (failed) {
      return setState((state) => ({ ...state, error: true, errorMsg: msg }));
    }
    return hardRedirectLocation(pageUrls.account);
  }
};

const AccountBilling = ({ billingData }) => {
  // Destructure data
  const { paymentMethod, subscription, productPlan } = billingData;
  const card = paymentMethod ? paymentMethod.card : null;
  const { name, price } = productPlan;

  // Component state
  const [state, setState] = useState({
    error: false,
    errorMsg: "An error occured. Try again later!",
  });

  return (
    <div className="p--1 brad bg--light m--y-1">
      <div className="flex">
        {/* Show the customer's current plan */}
        {name ? (
          <>
            <div className="flex--1-of-2 m--y-1">
              <h3>Current Plan</h3>
            </div>
            <div className="flex--1-of-2 m--y-1 text--info">
              <strong>{name}</strong>
              <small className="d--block">$ {price / 100} monthly</small>
            </div>

            {/* Show Minimal card details */}
            {card && (
              <>
                <div className="flex--1-of-2 m--y-1">
                  <h3> Card Details</h3>
                </div>
                <div className="flex--1-of-2 m--y-1">
                  <div className="p--tiny shadow--small">
                    <p>
                      Type: <strong>{card.brand}</strong>
                    </p>
                    <p>
                      Last 4 digits: <strong>{card.last4}</strong>
                    </p>
                  </div>
                </div>
              </>
            )}

            <Formik
              initialValues={{}}
              onSubmit={async () => await cancelPlan(subscription.id, setState)}
            >
              {(formik) => (
                <Form>
                  {/* Cancel Plan */}
                  {state.error && (
                    <Alert messages={state.errorMsg} type="danger" />
                  )}

                  <Button
                    type="submit"
                    variant="info"
                    isLoading={formik.isSubmitting}
                    className="m--y-1"
                  >
                    Cancel Current Plan
                  </Button>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          // Customer has no active plan
          <i>You are not subscribed to any plan</i>
        )}
      </div>

      {/* Change Plan */}
      <Link to={pageUrls.productPlans} className="link--white">
        {name ? "Change Plan" : "Subscribe to a plan"}
      </Link>
    </div>
  );
};

AccountBilling.propTypes = {
  billingData: PropTypes.object.isRequired,
};

export default AccountBilling;
