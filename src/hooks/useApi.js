import axios from "axios";
import { useEffect, useState } from "react";
import { configureAxios } from "../utils/api";

/**
 * Fetch api data using **axios** library.
 *
 * Actions are dispatched based on the return value of axios fetch
 * @param {String} initialEndpoint
 * @param {*} apiData
 * @param {String} method
 * @param {String} query
 * @access public
 */
const useApi = (
  initialEndpoint,
  apiData = null,
  method = "get",
  query = null
) => {
  // Always call configureAxios to get the latest values
  configureAxios();

  // Component State
  const [endpoint, setEndpoint] = useState(initialEndpoint);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState(null);

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
     * Helper to make api calls and update state
     */
    const fetchApiData = async () => {
      /* 
        `error` is always false and only gets updated if there
        was an error during the api call.
        Other states (data, status, msg) always depends on the
        outcome of the api call.
      */
      setError(false);
      setLoading(true);
      setStatus(null);
      setMsg(null);

      try {
        const result = await axios({
          url: `/${endpoint}${query ? `?${query}` : ""}`,
          method: method.toLowerCase(),
          data: apiData,
        });

        // Update states only if didCancel is false
        if (!didCancel) {
          setData(result.data);
          setStatus(result.status);
          setMsg(result.data.msg || result.statusText);
        }
      } catch (error) {
        // Update states only if didCancel is false
        if (!didCancel) {
          setError(true);

          // Error out of 2xx range
          if (error.response) {
            setData(error.response.data);
            setStatus(error.response.status);
            setMsg(error.response.data.msg || error.response.statusText);
          } else if (error.request) {
            // Error as a result of no response
            setData(error.request.data);
            setStatus(500);
            setMsg("ERROR: No response was received from this request!");
          } else {
            // Unknown Error
            setData(null);
            setStatus(500);
            setMsg(
              "ERROR: This request could not be completed due to unknown error!"
            );
          }
        }
      }

      // Loading is always false after api call irregardless of the result
      setLoading(false);
    };

    fetchApiData();

    // Clean up function
    return () => {
      didCancel = true;
    };
  }, [apiData, endpoint, method, query]);

  return [{ loading, data, status, msg, error }, setEndpoint];
};

export default useApi;
