/**
 * Application page urls
 */
export const pageUrls = {
  account: "/account",
  activateAccount: "/activate-account",
  board: "/boards",
  forgotPassword: "/forgot-password",
  home: "/home",
  landing: "/",
  login: "/login",
  notFound: "*",
  productPlans: "/product-plans",
  resetPassword: "/reset-password",
  signup: "/signup",
  task: "/tasks",
};

/**
 * Api endpoints used for navigating the website.
 */
export const endpoints = {
  signup: "signup",
  login: "login",
  boards: "boards",
  tasks: "tasks",
  account: {
    get: "account",
    verify: "account/verify",
    activateAcc: "activate-account",
    changePwd: "account/change-password",
    upgradeAcc: "account/upgrade-plan",
  },
  resetPwd: "reset-password",
  forgotPwd: "forgot-password",
  stripe: {
    session: "stripe/session",
    fetch: "stripe/fetch-plans",
    products: "stripe/products",
    customers: "stripe/customers",
    subscriptions: "stripe/subscriptions",
    setupintents: "stripe/setupintents",
  },
};

/**
 * Api constants
 */
export const api = {
  url: process.env.REACT_APP_API_URL + "/api",
  version: "/v1",
  keys: {
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  },

  // Getter for baseUrl
  get baseUrl() {
    return `${this.url}${this.version}`;
  },
};

/**
 * Actions that indicate what just happened
 */
export const actions = {
  api: {
    start: "FETCH_START",
    success: "FETCH_OKAY",
    fail: "FETCH_FAIL",
  },
};

/**
 * URLs to external scripts
 */
export const scriptUrls = {
  ioniconsUrl: "https://unpkg.com/ionicons@5.2.3/dist/ionicons.js",
  stripeJsUrl: "https://js.stripe.com/v3/",
};

/**
 * Months of the year
 */
export const months = {
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
};
