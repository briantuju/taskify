import { actions as fetchActions } from "../utils/constants";

// Destructure individual actions from api actions
const {
  api: { fail, start, success },
} = fetchActions;

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    // Api fetch started
    case start:
      return { ...state, loading: true, error: false };

    // Api fetch succeeded
    case success:
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      };

    // Api fetch failed
    case fail:
      return { ...state, loading: false, error: true };

    default:
      throw new Error();
  }
};

export default dataFetchReducer;
