import { LOGIN, LOGOUT, FETCH_TOKEN_SUCCESS, FETCH_TOKEN_FAILURE } from '../actions/auth'


const DEFAULT_STATE = {
    isLoggedIn: false,
    username: '',
    password: '',
    token: '',
    error: null
};

export default function auth(state = DEFAULT_STATE, action) {
  switch (action.type) {
      case LOGIN:
        return {
          ...state,
            isLoggedIn: true,
            username: action.username,
            password: action.password,
            token: action.token,
            error: null
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
            isLoggedIn: true,
            username: action.username,
            password: action.password,
            token: action.token,
            error: null
        };
      case FETCH_TOKEN_FAILURE:
        return {
          ...state,
            isLoggedIn: false,
            username: '',
            password: '',
            token: '',
            error: action.payload
        };
      default:
        return state;
    }
}
