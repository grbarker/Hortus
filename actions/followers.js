import axios from 'axios';

//Get category
export const FETCH_FOLLOWERS = 'FETCH_FOLLOWERS';
export const FETCH_FOLLOWERS_SUCCESS = 'FETCH_FOLLOWERS_SUCCESS';
export const FETCH_FOLLOWERS_FAILURE = 'FETCH_FOLLOWERS_FAILURE';
export const FETCH_MORE_FOLLOWERS_SUCCESS = 'FETCH_MORE_FOLLOWERS_SUCCESS';
export const LESS_FOLLOWERS = 'LESS_FOLLOWERS';
export const SHOW_FOLLOWERS = 'SHOW_FOLLOWERS';
export const HIDE_FOLLOWERS = 'HIDE_FOLLOWERS';

const api = "http://34.221.120.52/api/user/followers/"

export function getFollowers(dispatch, token, uri) {
  var uri = 'http://34.221.120.52' + uri
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of followers!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      dispatch(getMoreFollowersSuccess(response.data)) && console.log(response.data)
    })
    .catch(error => {
       dispatch(getMoreFollowersFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}

export function lessFollowers() {
  return {
    type: LESS_FOLLOWERS,
  };
}

export function showFollowers() {
  return {
    type: SHOW_FOLLOWERS,
  };
}

export function hideFollowers() {
  return {
    type: HIDE_FOLLOWERS,
  };
}


export function getFollowersSuccess(data) {
  return {
    type: FETCH_FOLLOWERS_SUCCESS,
    payload: data
  };
}

export function getFollowersFailure(data) {
  return {
    type: FETCH_FOLLOWERS_FAILURE,
    payload: data.error
  };
}

export function getMoreFollowersSuccess(data) {
  return {
    type: FETCH_MORE_FOLLOWERS_SUCCESS,
    payload: data
  };
}

export function getMoreFollowersFailure(data) {
  return {
    type: FETCH_MORE_FOLLOWERS_FAILURE,
    payload: data.error
  };
}
