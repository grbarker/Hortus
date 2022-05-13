import axios from 'axios';

export const FETCH_OTHER_WALL_POSTS = 'FETCH_OTHER_WALL_POSTS';
export const FETCH_OTHER_WALL_POSTS_SUCCESS = 'FETCH_OTHER_WALL_POSTS_SUCCESS';
export const FETCH_OTHER_WALL_POSTS_FAILURE = 'FETCH_OTHER_WALL_POSTS_FAILURE';
export const FETCH_MORE_OTHER_WALL_POSTS_SUCCESS = 'FETCH_MORE_OTHER_WALL_POSTS_SUCCESS';
export const FETCH_MORE_OTHER_WALL_POSTS_FAILURE = 'FETCH_MORE_OTHER_WALL_POSTS_FAILURE';
export const LESS_OTHER_WALL_POSTS = 'LESS_OTHER_WALL_POSTS';
export const SHOW_OTHER_WALL_POST_INPUT = 'SHOW_OTHER_WALL_POST_INPUT';
export const HIDE_OTHER_WALL_POST_INPUT = 'HIDE_OTHER_WALL_POST_INPUT';
export const SUBMIT_USER_OTHER_WALL_POST_SUCCESS = 'SUBMIT_USER_OTHER_WALL_POST_SUCCESS';
export const SUBMIT_USER_OTHER_WALL_POST_FAILURE = 'SUBMIT_USER_OTHER_WALL_POST_FAILURE';

const api = "http://45.79.227.26/api/posts/"

export function getOtherWallPosts(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://45.79.227.26' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of posts!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/posts')
      ? (dispatch(getOtherWallPostsSuccess(response.data)) && console.log('GETTING FIRST SET OF POSTS AGAIN AFTER A POST SUBMISSION'))
      : (dispatch(getMoreOtherWallPostsSuccess(response.data)) && console.log('GETTING MORE POSTS'))
    })
    .catch(error => {
       dispatch(getMoreOtherWallPostsFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}


export function submitUserOtherWallPostFetch(dispatch, token, postText) {
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
      dispatch(submitUserOtherWallPostSuccess(response.data)) && console.log(response)
      //dispatch(getOtherWallPosts(dispatch, token, '/api/posts'))
    })
    .catch(error => {
       dispatch(submitUserOtherWallPostFailure(error.response.data)) && console.log('ERROR ! ! !', error.response.data) && console.log('response, ', response)
    })
    };
}


export function submitUserOtherWallPost(dispatch, token, postText) {
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
      dispatch(getOtherWallPosts(dispatch, token, '/api/posts'))
    })
    .catch(error => {
       dispatch(submitUserOtherWallPostFailure(error)) && console.log('ERROR ! ! !', error)
    })
    };
}

export function lessOtherWallPosts() {
  return {
    type: LESS_OTHER_WALL_POSTS,
  };
}

export function showOtherWallPostInput() {
  return {
    type: SHOW_OTHER_WALL_POST_INPUT,
  };
}

export function hideOtherWallPostInput() {
  return {
    type: HIDE_OTHER_WALL_POST_INPUT,
  };
}

export function getOtherWallPostsSuccess(data) {
  return {
    type: FETCH_OTHER_WALL_POSTS_SUCCESS,
    payload: data
  };
}

export function getOtherWallPostsFailure(data) {
  return {
    type: FETCH_OTHER_WALL_POSTS_FAILURE,
    payload: data.error
  };
}

export function getMoreOtherWallPostsSuccess(data) {
  return {
    type: FETCH_MORE_OTHER_WALL_POSTS_SUCCESS,
    payload: data
  };
}

export function getMoreOtherWallPostsFailure(data) {
  return {
    type: FETCH_MORE_OTHER_WALL_POSTS_FAILURE,
    payload: data.error
  };
}

export function submitUserOtherWallPostSuccess(data) {
  return {
    type: SUBMIT_USER_OTHER_WALL_POST_SUCCESS,
    payload: data
  };
}

export function submitUserOtherWallPostFailure(data) {
  return {
    type: SUBMIT_USER_OTHER_WALL_POST_FAILURE,
    payload: data.error
  };
}
