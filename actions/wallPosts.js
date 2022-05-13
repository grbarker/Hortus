import axios from 'axios';

export const FETCH_WALL_POSTS = 'FETCH_WALL_POSTS';
export const FETCH_WALL_POSTS_SUCCESS = 'FETCH_WALL_POSTS_SUCCESS';
export const FETCH_WALL_POSTS_FAILURE = 'FETCH_WALL_POSTS_FAILURE';
export const FETCH_MORE_WALL_POSTS_SUCCESS = 'FETCH_MORE_WALL_POSTS_SUCCESS';
export const FETCH_MORE_WALL_POSTS_FAILURE = 'FETCH_MORE_WALL_POSTS_FAILURE';
export const LESS_WALL_POSTS = 'LESS_WALL_POSTS';
export const SHOW_WALL_POST_INPUT = 'SHOW_WALL_POST_INPUT';
export const HIDE_WALL_POST_INPUT = 'HIDE_WALL_POST_INPUT';
export const SUBMIT_USER_WALL_POST_SUCCESS = 'SUBMIT_USER_WALL_POST_SUCCESS';
export const SUBMIT_USER_WALL_POST_FAILURE = 'SUBMIT_USER_WALL_POST_FAILURE';

const api = "http://45.79.227.26/api/posts/"

export function getWallPosts(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://45.79.227.26' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of posts!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/posts')
      ? (dispatch(getWallPostsSuccess(response.data)) && console.log('GETTING FIRST SET OF POSTS AGAIN AFTER A POST SUBMISSION'))
      : (dispatch(getMoreWallPostsSuccess(response.data)) && console.log('GETTING MORE POSTS'))
    })
    .catch(error => {
       dispatch(getMoreWallPostsFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}


export function submitUserWallPostFetch(dispatch, token, postText) {
  var uri = 'http://45.79.227.26/api/user/post'
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
      dispatch(submitUserWallPostSuccess(response.data)) && console.log(response)
      //dispatch(getWallPosts(dispatch, token, '/api/posts'))
    })
    .catch(error => {
       dispatch(submitUserWallPostFailure(error.response.data)) && console.log('ERROR ! ! !', error.response.data) && console.log('response, ', response)
    })
    };
}


export function submitUserWallPost(dispatch, token, postText) {
  var uri = 'http://45.79.227.26/api/user/post'
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
      dispatch(getWallPosts(dispatch, token, '/api/posts'))
    })
    .catch(error => {
       dispatch(submitUserWallPostFailure(error)) && console.log('ERROR ! ! !', error)
    })
    };
}

export function lessWallPosts() {
  return {
    type: LESS_WALL_POSTS,
  };
}

export function showWallPostInput() {
  return {
    type: SHOW_WALL_POST_INPUT,
  };
}

export function hideWallPostInput() {
  return {
    type: HIDE_WALL_POST_INPUT,
  };
}

export function getWallPostsSuccess(data) {
  return {
    type: FETCH_WALL_POSTS_SUCCESS,
    payload: data
  };
}

export function getWallPostsFailure(data) {
  return {
    type: FETCH_WALL_POSTS_FAILURE,
    payload: data.error
  };
}

export function getMoreWallPostsSuccess(data) {
  return {
    type: FETCH_MORE_WALL_POSTS_SUCCESS,
    payload: data
  };
}

export function getMoreWallPostsFailure(data) {
  return {
    type: FETCH_MORE_WALL_POSTS_FAILURE,
    payload: data.error
  };
}

export function submitUserWallPostSuccess(data) {
  return {
    type: SUBMIT_USER_WALL_POST_SUCCESS,
    payload: data
  };
}

export function submitUserWallPostFailure(data) {
  return {
    type: SUBMIT_USER_WALL_POST_FAILURE,
    payload: data.error
  };
}