import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Guess the timezone and set it as default timezone
dayjs.tz.setDefault(dayjs.tz.guess());

/**
 * Helper class to work with date and time
 * @access public
 */
export class DateTime {
  /**
   * Return relative time from now
   * @param {String} date
   */
  static fromNow(date) {
    return dayjs(date).fromNow();
  }

  /**
   * Return relative time to X
   * @param {String} x
   */
  static timeToX(x) {
    return dayjs().to(x);
  }

  /**
   * Returns the difference between two date-time
   * in the specified unit
   * @param {String} date1
   * @param {String} date2
   * @param {String} unit
   */
  static diffInDates(date1, date2, unit = "day") {
    date1 = dayjs(date1);
    date2 = dayjs(date2);
    return date1.diff(date2, unit);
  }

  /**
   * Converts date to ISO string
   * @param {String} dateString
   */
  static toIsoString(dateString) {
    return dayjs(dateString).toISOString();
  }

  /**
   * Get the formatted date according to the string
   * of tokens passed in
   * @param {String} date
   * @param {String} format
   */
  static formatDate(date, format) {
    return dayjs(date).format(format);
  }
}

/**
 * Helper class to work with the application storage
 * @access public
 */
export class AppStorage {
  /**
   * Save item to local storage
   * @param {String} key
   * @param {*} value
   * @static @public
   */
  static setItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Save auth token to local storage
   * @param {String} token
   * @static @public
   */
  static setJwtToken(token) {
    return this.setItem("jwt", token);
  }

  /**
   * Retrieve an item from local storage
   * @param {String} key
   * @static @public @returns {?String}
   */
  static getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * Retrieve auth token
   * @static @public @returns {?String}
   */
  static getAuthToken() {
    return this.getItem("jwt");
  }

  /**
   * Remove an item from local storage
   * @param {String} key
   * @static @public
   */
  static removeItem(key) {
    return localStorage.removeItem(key);
  }

  /**
   * Remove auth token from storage
   * @static @public
   */
  static removeAuthToken() {
    return this.removeItem("jwt");
  }
}

/**
 * Check if environment is browser or node
 */
export const isBrowser = () => typeof window !== "undefined";

/**
 * Extract form values from form element
 * @param {HTMLFormElement} e
 * @returns {object}
 */
export const extractFormData = (e) => {
  let data = {};

  const formData = new FormData(e.target);
  for (const item of formData.entries()) data[item[0]] = item[1];

  return data;
};

/**
 * Redirect page to the specified location with full page reload
 * @param {String} location
 * @returns {void}
 */
export const hardRedirectLocation = (location) => {
  window.location = location;
};
