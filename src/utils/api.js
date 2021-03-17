import axios from "axios";
import { api } from "./constants";
import { AppStorage } from "./helpers";

/**
 * Configure Axios without hooks
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
 * Make api call using axios
 * @param {String} url
 */
export const fetchData = async (url) => {
  // Always call configureAxios to get the latest values
  configureAxios();

  const { data } = await axios({ url });

  return data;
};
