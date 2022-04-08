import axios from 'axios';

export const FETCH_POSTS = 'FETCH_POSTS';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';
export const FETCH_MORE_POSTS_SUCCESS = 'FETCH_MORE_POSTS_SUCCESS';
export const FETCH_MORE_POSTS_FAILURE = 'FETCH_MORE_POSTS_FAILURE';
export const LESS_POSTS = 'LESS_POSTS';
export const SHOW_POST_INPUT = 'SHOW_POST_INPUT';
export const HIDE_POST_INPUT = 'HIDE_POST_INPUT';
export const SUBMIT_USER_POST_SUCCESS = 'SUBMIT_USER_POST_SUCCESS';
export const SUBMIT_USER_POST_FAILURE = 'SUBMIT_USER_POST_FAILURE';

const api = "http://34.221.120.52/api/posts/"

export function getPosts(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://34.221.120.52' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of posts!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/posts')
      ? (dispatch(getPostsSuccess(response.data)) && console.log('GETTING FIRST SET OF POSTS AGAIN AFTER A POST SUBMISSION'))
      : (dispatch(getMorePostsSuccess(response.data)) && console.log('GETTING MORE POSTS'))
    })
    .catch(error => {
       dispatch(getMorePostsFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}


export function submitUserPostFetch(dispatch, token, postText) {
  var uri = 'http://34.221.120.52/api/user/post'
  return function (dispatch)  {
    console.log("Trying to DEBUG this fetch POST request for submitting a user post!!!", token, ", ", postText)
    fetch(uri, {
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
      data: {
        postText: postText
      }
    })
    .then((response) => {
      dispatch(submitUserPostSuccess(response.data)) && console.log(response)
      //dispatch(getPosts(dispatch, token, '/api/posts'))
    })
    .catch(error => {
       dispatch(submitUserPostFailure(error.response.data)) && console.log('ERROR ! ! !', error.response.data) && console.log('response, ', response)
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
      dispatch(getPosts(dispatch, token, '/api/posts'))
    })
    .catch(error => {
       dispatch(submitUserPostFailure(error)) && console.log('ERROR ! ! !', error)
    })
    };
}

export function lessPosts() {
  return {
    type: LESS_POSTS,
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

export function getPostsSuccess(data) {
  return {
    type: FETCH_POSTS_SUCCESS,
    payload: data
  };
}

export function getPostsFailure(data) {
  return {
    type: FETCH_POSTS_FAILURE,
    payload: data.error
  };
}

export function getMorePostsSuccess(data) {
  return {
    type: FETCH_MORE_POSTS_SUCCESS,
    payload: data
  };
}

export function getMorePostsFailure(data) {
  return {
    type: FETCH_MORE_POSTS_FAILURE,
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
