//Post to the mobile login API endpoint
import axios from 'axios';

export const FETCH_TOKEN_SUCCESS = 'FETCH_TOKEN_SUCCESS';
export const FETCH_TOKEN_FAILURE = 'FETCH_TOKEN_FAILURE';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const NO_LOGIN_STORED = 'NO_LOGIN_STORED';
export const SET_LOGIN = 'SET_LOGIN';
export const SET_SIGNUP = 'SET_SIGNUP';

export function login(username, password, token) {
    return {
        type: LOGIN,
        username: username,
        password: password,
        token: token
    };
};

export const logout = () => {
    return {
        type: LOGOUT
    };
};

export function signup(username, email, password) {
    return  {
      type: SIGNUP
    };
};


export function getTokenSuccess(username, password, token) {
  return {
    type: FETCH_TOKEN_SUCCESS,
    username: username,
    password:password,
    token: token,
  };
}

export function getTokenFailure(error) {
  return {
    type: FETCH_TOKEN_FAILURE,
    payload: error
  };
}

export function noLoginStored() {
  return {
    type: NO_LOGIN_STORED,
  };
}

export function setLogin() {
  return {
    type: SET_LOGIN,
  };
}

export function setSignUp() {
  return {
    type: SET_SIGNUP,
  };
}
