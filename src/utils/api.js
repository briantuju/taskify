import axios from "axios";
import { api } from "./constants";
import { AppStorage } from "./helpers";

/**
 * This helper function loads the `token` from `localStorage`
 * and then sets the _defaults_ for **axios** library.
 *
 * @access public
 */
export const configureAxios = () => {
  // Get auth token from app storage
  const token = AppStorage.getAuthToken() || "";

  // Set defaults for base url and headers
  axios.defaults.baseURL = api.baseUrl;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";
};

/**
 * Make api call without using hooks
 * @param {String} url
 * @param {*} apiData
 * @param {String} method
 * @access public
 */
export const fetchData = async (url, apiData = null, method = "GET") => {
  // Always call configureAxios to get the latest values
  configureAxios();

  try {
    const result = await axios({
      url,
      method: method.toLowerCase(),
      data: apiData,
    });

    return {
      data: result.data,
      status: result.status,
      msg: result.data.msg || result.statusText,
      failed: result.status > 399,
    };
  } catch (error) {
    // Error out of 2xx range
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
        msg: error.response.data.msg || error.response.statusText,
        failed: true,
      };
    }

    // Error as a result of no response
    if (error.request) {
      return {
        data: error.request,
        status: 500,
        msg: "ERROR: No response was received from this request!",
        failed: true,
      };
    }

    // Unknown Error
    return {
      data: null,
      status: 500,
      msg: "ERROR: This request could not be completed due to unknown error!",
      failed: true,
    };
  }
};
