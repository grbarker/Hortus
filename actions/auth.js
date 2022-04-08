//Post to the mobile login API endpoint
import axios from 'axios';

export const FETCH_TOKEN_SUCCESS = 'FETCH_TOKEN_SUCCESS';
export const FETCH_TOKEN_FAILURE = 'FETCH_TOKEN_FAILURE';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';


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

export const signup = (username, password) => {
    return (dispatch) => {
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
