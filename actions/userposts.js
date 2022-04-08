import axios from 'axios';

//Get category
export const FETCH_USER_POSTS = 'FETCH_USER_POSTS';
export const FETCH_USER_POSTS_SUCCESS = 'FETCH_USER_POSTS_SUCCESS';
export const FETCH_USER_POSTS_FAILURE = 'FETCH_USER_POSTS_FAILURE';
export const FETCH_MORE_USER_POSTS_SUCCESS = 'FETCH_MORE_USER_POSTS_SUCCESS';
export const LESS_USER_POSTS = 'LESS_USER_POSTS';
export const SHOW_POST_INPUT = 'SHOW_POST_INPUT';
export const HIDE_POST_INPUT = 'HIDE_POST_INPUT';
export const SUBMIT_USER_POST_SUCCESS = 'SUBMIT_USER_POST_SUCCESS';
export const SUBMIT_USER_POST_FAILURE = 'SUBMIT_USER_POST_FAILURE';

const api = "http://34.221.120.52/api/user/posts/"

export function getUserPosts(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://34.221.120.52' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of posts!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/user/posts')
      ? (dispatch(getUserPostsSuccess(response.data)) && console.log('GETTING FIRST SET OF USERS POSTS AGAIN AFTER A POST SUBMISSION'))
      : (dispatch(getMoreUserPostsSuccess(response.data)) && console.log('GETTING MORE USER POSTS', response.data))
    })
    .catch(error => {
       dispatch(getMoreUserPostsFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}

export function submitUserPost(dispatch, token, postText) {
  var uri = 'http://34.221.120.52/api/user/post'
  return function (dispatch)  {
    console.log("Trying to DEBUG this axios POST request for submitting a user post!!!", token, ", ", postText)
    axios({
      method: 'post',
      url: uri,
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        "postText": postText
      }
    })
    .then((response) => {
      dispatch(getUserPosts(dispatch, token, '/api/user/posts'))
    })
    .catch(error => {
       dispatch(submitUserPostFailure(error)) && console.log('ERROR ! ! !', error)
    })
    };
}

export function lessUserPosts() {
  return {
    type: LESS_USER_POSTS,
  };
}

export function showPostInput() {
  return {
    type: SHOW_POST_INPUT,
  };
}

export function hidePostInput() {
  return {
    type: HIDE_POST_INPUT,
  };
}

export function getUserPostsSuccess(data) {
  return {
    type: FETCH_USER_POSTS_SUCCESS,
    payload: data
  };
}

export function getUserPostsFailure(data) {
  return {
    type: FETCH_USER_POSTS_FAILURE,
    payload: data.error
  };
}

export function getMoreUserPostsSuccess(data) {
  return {
    type: FETCH_MORE_USER_POSTS_SUCCESS,
    payload: data
  };
}

export function getMoreUserPostsFailure(data) {
  return {
    type: FETCH_MORE_USER_POSTS_FAILURE,
    payload: data.error
  };
}

export function submitUserPostSuccess(data) {
  return {
    type: SUBMIT_USER_POST_SUCCESS,
    payload: data
  };
}

export function submitUserPostFailure(data) {
  return {
    type: SUBMIT_USER_POST_FAILURE,
    payload: data.error
  };
}
