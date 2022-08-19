import axios from 'axios';

//Get category
export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_OTHER_USER_SUCCESS = 'FETCH_OTHER_USER_SUCCESS';
export const FETCH_OTHER_USER_FAILURE = 'FETCH_OTHER_USER_FAILURE';
export const SET_OTHER_USER = 'SET_OTHER_USER';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_USER = 'SET_USER';
export const SET_USER_ID = 'SET_USER_ID';
export const GO_BACK_PROFILE = 'GO_BACK_PROFILE';
export const NO_BACK_PROFILE = 'NO_BACK_PROFILE';

const api = "http://45.79.227.26/api/user"

export function getUser(token) {
  const request = axios({
    method: 'get',
    url: `${api}`,
    headers: {Authorization: `Bearer ${token}`}
  });

  return {
    type: FETCH_USER,
    payload: request
  };
}

export function setCurrentUser() {
  return {
    type: SET_CURRENT_USER,
  }
}

export function setOtherUser(id) {
  return {
    type: SET_OTHER_USER,
    payload: id
  }
}

export function setUser(users) {
  return {
    type: SET_USER,
    payload: users
  }
}

export function setUserId(id) {
  return {
    type: SET_USER_ID,
    payload: id
  }
}

export function goBackProfile() {
  return {
    type: GO_BACK_PROFILE,
  }
}

export function noBackProfile() {
  return {
    type: NO_BACK_PROFILE,
  }
}

export function getUserSuccess(data) {
  return {
    type: FETCH_USER_SUCCESS,
    payload: data
  };
}

export function getUserFailure(data) {
  return {
    type: FETCH_USER_FAILURE,
    payload: data.error
  };
}

export function getOtherUserSuccess(data) {
  return {
    type: FETCH_OTHER_USER_SUCCESS,
    payload: data
  };
}

export function getOtherUserFailure(data) {
  return {
    type: FETCH_OTHER_USER_FAILURE,
    payload: data.error
  };
}
