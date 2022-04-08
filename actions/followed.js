import axios from 'axios';

//Get category
export const FETCH_FOLLOWED = 'FETCH_FOLLOWED';
export const FETCH_FOLLOWED_SUCCESS = 'FETCH_FOLLOWED_SUCCESS';
export const FETCH_FOLLOWED_FAILURE = 'FETCH_FOLLOWED_FAILURE';
export const FETCH_MORE_FOLLOWED_SUCCESS = 'FETCH_MORE_FOLLOWED_SUCCESS';
export const LESS_FOLLOWED = 'LESS_FOLLOWED';
export const SHOW_FOLLOWED = 'SHOW_FOLLOWED';
export const HIDE_FOLLOWED = 'HIDE_FOLLOWED';

const api = "http://34.221.120.52/api/user/followed/"

export function getFollowed(dispatch, token, uri) {
  var uri = 'http://34.221.120.52' + uri
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of followed!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      dispatch(getMoreFollowedSuccess(response.data)) && console.log(response.data)
    })
    .catch(error => {
       dispatch(getMoreFollowedFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}

export function lessFollowed() {
  return {
    type: LESS_FOLLOWED,
  };
}

export function showFollowed() {
  return {
    type: SHOW_FOLLOWED,
  };
}

export function hideFollowed() {
  return {
    type: HIDE_FOLLOWED,
  };
}


export function getFollowedSuccess(data) {
  return {
    type: FETCH_FOLLOWED_SUCCESS,
    payload: data
  };
}

export function getFollowedFailure(data) {
  return {
    type: FETCH_FOLLOWED_FAILURE,
    payload: data.error
  };
}

export function getMoreFollowedSuccess(data) {
  return {
    type: FETCH_MORE_FOLLOWED_SUCCESS,
    payload: data
  };
}

export function getMoreFollowedFailure(data) {
  return {
    type: FETCH_MORE_FOLLOWED_FAILURE,
    payload: data.error
  };
}
