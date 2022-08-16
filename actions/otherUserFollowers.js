import axios from 'axios';

export const FETCH_OTHER_USER_FOLLOWERS = 'FETCH_OTHER_USER_FOLLOWERS';
export const FETCH_OTHER_USER_FOLLOWERS_SUCCESS = 'FETCH_OTHER_USER_FOLLOWERS_SUCCESS';
export const FETCH_OTHER_USER_FOLLOWERS_FAILURE = 'FETCH_OTHER_USER_FOLLOWERS_FAILURE';
export const FETCH_MORE_OTHER_USER_FOLLOWERS_SUCCESS = 'FETCH_MORE_OTHER_USER_FOLLOWERS_SUCCESS';
export const FETCH_MORE_OTHER_USER_FOLLOWERS_FAILURE = 'FETCH_MORE_OTHER_USER_FOLLOWERS_FAILURE';
export const LESS_OTHER_USER_FOLLOWERS = 'LESS_OTHER_USER_FOLLOWERS';


export function getOtherUserFollowers(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://45.79.227.26' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of followers!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/user/followers')
      ? dispatch(getOtherUserFollowersSuccess(response.data)) && console.log(response.data, 'GETTING FIRST SET OF FOLLOWERS AGAIN AFTER A POST SUBMISSION')
      : (dispatch(getMoreOtherUserFollowersSuccess(response.data)) && console.log('GETTING MORE FOLLOWERS'))
    })
    .catch(error => {
       dispatch(getMoreOtherUserFollowersFailure(error)) && console.log(error)
    })
    };
}

export function lessOtherUserFollowers(nextLink, selfLink) {
  return {
    type: LESS_OTHER_USER_FOLLOWERS,
    nextLink,
    selfLink
  };
}

export function getOtherUserFollowersSuccess(data) {
  return {
    type: FETCH_OTHER_USER_FOLLOWERS_SUCCESS,
    payload: data
  };
}

export function getOtherUserFollowersFailure(data) {
  return {
    type: FETCH_OTHER_USER_FOLLOWERS_FAILURE,
    payload: data.error
  };
}

export function getMoreOtherUserFollowersSuccess(data) {
  return {
    type: FETCH_MORE_OTHER_USER_FOLLOWERS_SUCCESS,
    payload: data
  };
}

export function getMoreOtherUserFollowersFailure(error) {
  return {
    type: FETCH_MORE_OTHER_USER_FOLLOWERS_FAILURE,
    payload: error
  };
}
