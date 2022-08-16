import axios from 'axios';

export const FETCH_OTHER_USER_FOLLOWED = 'FETCH_OTHER_USER_FOLLOWED';
export const FETCH_OTHER_USER_FOLLOWED_SUCCESS = 'FETCH_OTHER_USER_FOLLOWED_SUCCESS';
export const FETCH_OTHER_USER_FOLLOWED_FAILURE = 'FETCH_OTHER_USER_FOLLOWED_FAILURE';
export const FETCH_MORE_OTHER_USER_FOLLOWED_SUCCESS = 'FETCH_MORE_OTHER_USER_FOLLOWED_SUCCESS';
export const FETCH_MORE_OTHER_USER_FOLLOWED_FAILURE = 'FETCH_MORE_OTHER_USER_FOLLOWED_FAILURE';
export const LESS_OTHER_USER_FOLLOWED = 'LESS_OTHER_USER_FOLLOWED';


export function getOtherUserFollowed(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://45.79.227.26' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of followed!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/user/followed')
      ? dispatch(getOtherUserFollowedSuccess(response.data)) && console.log(response.data, 'GETTING FIRST SET OF FOLLOWED AGAIN AFTER A POST SUBMISSION')
      : (dispatch(getMoreOtherUserFollowedSuccess(response.data)) && console.log('GETTING MORE FOLLOWED'))
    })
    .catch(error => {
       dispatch(getMoreOtherUserFollowedFailure(error)) && console.log(error)
    })
    };
}

export function lessOtherUserFollowed(nextLink, selfLink) {
  return {
    type: LESS_OTHER_USER_FOLLOWED,
    nextLink,
    selfLink
  };
}

export function getOtherUserFollowedSuccess(data) {
  return {
    type: FETCH_OTHER_USER_FOLLOWED_SUCCESS,
    payload: data
  };
}

export function getOtherUserFollowedFailure(data) {
  return {
    type: FETCH_OTHER_USER_FOLLOWED_FAILURE,
    payload: data.error
  };
}

export function getMoreOtherUserFollowedSuccess(data) {
  return {
    type: FETCH_MORE_OTHER_USER_FOLLOWED_SUCCESS,
    payload: data
  };
}

export function getMoreOtherUserFollowedFailure(error) {
  return {
    type: FETCH_MORE_OTHER_USER_FOLLOWED_FAILURE,
    payload: error
  };
}
