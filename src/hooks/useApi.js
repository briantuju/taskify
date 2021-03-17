import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { actions as fetchActions, api } from "../utils/constants";
import { AppStorage } from "../utils/helpers";

// Destructure individual actions from api actions
const {
  api: { fail, start, success },
} = fetchActions;

/**
 * It returns a `state` object and a `dispatch` function
 * to alter the state object.
 *
 * The `dispatch` function takes an `action`
 * which has a **mandatory `type`** and an _optional_ `payload`.
 *
 * All this information is used in the actual `reducer` function
 * to distill a new `state` from the previous `state`
 *
 * @access private
 */
const dataFetchReducer = (state, action) => {
  /* 
    A reducer function has access to the current `state` 
    and the incoming `action` via its arguments
  */
  switch (action.type) {
    // Fetch initialized
    case start:
      return { ...state, loading: true, error: false };

    // Fetch fails
    case fail:
      return { ...state, loading: false, error: true };

    // Fetch succeeds
    case success:
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      };

    default:
      throw new Error();
  }
};

/**
 * This helper function loads the `token` from `localStorage`
 * and then sets the _defaults_ for **axios** library.
 *
 * @access private
 */
const configureAxios = () => {
  // Get auth token from app storage
  const token = AppStorage.getAuthToken() || "";

  // Set defaults for base url and headers
  axios.defaults.baseURL = api.baseUrl;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";
};

/**
 * Fetch api data using **axios** library.
 *
 * Actions are dispatched based on the return value of axios fetch
 * @param {String} initialEndpoint
 * @param {*} initialData
 * @param {String} method
 * @param {*} apiData
 * @access public
 */

const useApi = (
  initialEndpoint,
  initialData = null,
  method = "get",
  apiData = null
) => {
  // Always call configureAxios to get the latest values
  configureAxios();

  // Component State
  const [endpoint, setEndpoint] = useState(initialEndpoint);

  // Handle related states using a reducer
  const [state, dispatch] = useReducer(dataFetchReducer, {
    error: false,
    loading: false,
    data: initialData,
  });

  // Handle data fetching using hooks
  useEffect(() => {
    /**
     * This flag controls whether fetch action is dispatched or not.
     *
     * If the component did unmount, this flag should be set to `true`
     * which results in preventing to set the component state after
     * the data fetching has been asynchronously resolved.
     *
     * **Note: Data fetching is not aborted**
     */
    let didCancel = false;

    /**
     * Helper to make api calls and update state using `dispatch`
     */
    const fetchApiData = async () => {
      /* 
        When fetching data, the `dispatch` function can be used 
        to send information to the `reducer` function.

        The object being sent with the `dispatch` function 
        has a mandatory `type` property and an optional `payload` 
        property.
      */
      dispatch({ type: start });

      try {
        const result = await axios({
          url: `/${endpoint}`,
          method: method.toLowerCase(),
          data: apiData,
        });

        // Dispatch only if it wasn't cancelled
        if (!didCancel) {
          dispatch({ type: success, payload: result });
        }
      } catch (error) {
        // Dispatch only if it wasn't cancelled
        if (!didCancel) {
          dispatch({ type: fail });
        }
      }
    };

    fetchApiData();

    // Clean up function
    return () => {
      didCancel = true;
    };
  }, [apiData, endpoint, method]);

  /* 
    The data being consumed is in the state in this form:
      {
        error: Boolean,
        loading: Boolean,
        data: any*,
      }
  */
  return [state, setEndpoint];
};

export default useApi;
