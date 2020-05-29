import * as actions from "../actions/actionTypes";
import initialState from "../store/initialState";


const rootReducer = function (state = initialState, action) {
  let newState;

  switch (action.type) {
    //
    // submission form
    //
    case actions.SUBMIT_JOB:
      switch (action.status) {
        case 'success':
          return Object.assign({}, state, {
            jobId: action.data,
            status: "RUNNING",
            submissionError: ""
          });
        case 'error':
          return Object.assign({}, state, {status: "error", submissionError: action.response.statusText});
        default:
          return newState;
      }

    case actions.EXAMPLE_SEQUENCE:
      return Object.assign({}, state, {
        jobId: null,
        sequence: action.sequence,
        status: "notSubmitted",
      });

    case actions.CLEAR_SEQUENCE:
      return Object.assign({}, state, {
        jobId: null,
        status: "notSubmitted",
        sequence: "",
      });

    case actions.TEXTAREA_CHANGE:
      return Object.assign({}, state, {
        jobId: null,
        status: "notSubmitted",
        sequence: action.sequence,
      });

    case actions.INVALID_SEQUENCE:
      return Object.assign({}, state, {status: "invalidSequence"});

    //
    // status
    //
    case actions.FETCH_STATUS:
      if (action === 'error') {
        return Object.assign({}, state, {status: "error"});
      } else {
        return Object.assign({}, state, {status: action})
      }

    case actions.SET_STATUS_TIMEOUT:
      return Object.assign({}, state, {statusTimeout: action.statusTimeout});

    //
    // results
    //
    case actions.FETCH_RESULTS:
      return Object.assign({}, state, {status: "FINISHED"});

    default:
      return state;
  }
};

export default rootReducer;