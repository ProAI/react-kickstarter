import {
  INFO_REQUEST,
  INFO_SUCCESS,
  INFO_FAILURE,
} from './constants';

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case INFO_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    case INFO_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      };
    default:
      return state;
  }
}