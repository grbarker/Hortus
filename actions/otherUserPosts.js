import axios from 'axios';

export const FETCH_OTHER_USER_POSTS = 'FETCH_OTHER_USER_POSTS';
export const FETCH_OTHER_USER_POSTS_SUCCESS = 'FETCH_OTHER_USER_POSTS_SUCCESS';
export const FETCH_OTHER_USER_POSTS_FAILURE = 'FETCH_OTHER_USER_POSTS_FAILURE';
export const FETCH_MORE_OTHER_USER_POSTS_SUCCESS = 'FETCH_MORE_OTHER_USER_POSTS_SUCCESS';
export const FETCH_MORE_OTHER_USER_POSTS_FAILURE = 'FETCH_MORE_OTHER_USER_POSTS_FAILURE';
export const LESS_OTHER_USER_POSTS = 'LESS_OTHER_USER_POSTS';


export function getOtherUserPosts(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://34.221.120.52' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of posts!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/user/posts')
      ? dispatch(getOtherUserPostsSuccess(response.data)) && console.log(response.data, 'GETTING FIRST SET OF POSTS AGAIN AFTER A POST SUBMISSION')
      : (dispatch(getMoreOtherUserPostsSuccess(response.data)) && console.log('GETTING MORE POSTS'))
    })
    .catch(error => {
       dispatch(getMoreOtherUserPostsFailure(error)) && console.log(error)
    })
    };
}

export function lessOtherUserPosts(nextLink, selfLink) {
  return {
    type: LESS_OTHER_USER_POSTS,
    nextLink,
    selfLink
  };
}

export function getOtherUserPostsSuccess(data) {
  return {
    type: FETCH_OTHER_USER_POSTS_SUCCESS,
    payload: data
  };
}

export function getOtherUserPostsFailure(data) {
  return {
    type: FETCH_OTHER_USER_POSTS_FAILURE,
    payload: data.error
  };
}

export function getMoreOtherUserPostsSuccess(data) {
  return {
    type: FETCH_MORE_OTHER_USER_POSTS_SUCCESS,
    payload: data
  };
}

export function getMoreOtherUserPostsFailure(error) {
  return {
    type: FETCH_MORE_OTHER_USER_POSTS_FAILURE,
    payload: error
  };
}
