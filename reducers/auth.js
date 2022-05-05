import {
  LOGIN, LOGOUT, FETCH_TOKEN_SUCCESS, FETCH_TOKEN_FAILURE,
  NO_LOGIN_STORED, SET_LOGIN, SET_SIGNUP, LOGIN_FAIL
} from '../actions/auth'


const DEFAULT_STATE = {
    isLoggedIn: false,
    isLoading: true,
    username: '',
    password: '',
    token: '',
    error: null,
    message: null,
    loginScreen: true
};

export default function auth(state = DEFAULT_STATE, action) {
  switch (action.type) {
      case LOGIN:
        return {
          ...state,
            isLoading: false,
            isLoggedIn: true,
            username: action.username,
            password: action.password,
            token: action.token,
            error: null
        };
      case LOGIN_FAIL:
        return {
          ...state,
            isLoading: false,
            isLoggedIn: false,
            error: action.error,
            message: action.message,
        };
      case LOGOUT:
        return {
          ...state,
            isLoggedIn: false,
            username: '',
            password: '',
            token: '',
            error: null
        };
      case FETCH_TOKEN_SUCCESS:
        return {
          ...state,
            isLoading: false,
            isLoggedIn: true,
            username: action.username,
            password: action.password,
            token: action.token,
            error: null
        };
      case FETCH_TOKEN_FAILURE:
        return {
          ...state,
            isLoading: false,
            isLoggedIn: false,
            username: '',
            password: '',
            token: '',
            error: action.payload
        };
      case NO_LOGIN_STORED:
        return {
          ...state,
            isLoading: false,
        };
      case SET_LOGIN:
        return {
          ...state,
          loginScreen: true
        };
      case SET_SIGNUP:
        return {
          ...state,
          loginScreen: false
        };
      default:
        return state;
    }
}
