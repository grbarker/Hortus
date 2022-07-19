import axios from 'axios';

export const FETCH_WALL_POSTS = 'FETCH_WALL_POSTS';
export const FETCH_WALL_POSTS_SUCCESS = 'FETCH_WALL_POSTS_SUCCESS';
export const FETCH_WALL_POSTS_FAILURE = 'FETCH_WALL_POSTS_FAILURE';
export const FETCH_MORE_WALL_POSTS_SUCCESS = 'FETCH_MORE_WALL_POSTS_SUCCESS';
export const FETCH_MORE_WALL_POSTS_FAILURE = 'FETCH_MORE_WALL_POSTS_FAILURE';
export const LESS_WALL_POSTS = 'LESS_WALL_POSTS';
export const SHOW_WALL_POST_INPUT = 'SHOW_WALL_POST_INPUT';
export const HIDE_WALL_POST_INPUT = 'HIDE_WALL_POST_INPUT';
export const SUBMIT_WALL_POST_SUCCESS = 'SUBMIT_WALL_POST_SUCCESS';
export const SUBMIT_WALL_POST_FAILURE = 'SUBMIT_WALL_POST_FAILURE';
export const SHOW_REPLY_INPUT = 'SHOW_REPLY_INPUT';
export const HIDE_REPLY_INPUT = 'HIDE_REPLY_INPUT';

const api = "http://45.79.227.26/api/posts/"

export function getWallPostReplies(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://45.79.227.26' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of wall posts!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      dispatch(getWallPostRepliesSuccess(response.data)) && console.log('FETCHED FIRST SET OF WALL POSTS AGAIN AFTER A POST SUBMISSION', response.data)
    })
    .catch(error => {
       dispatch(getWallPostRepliesFailure(error.response.data)) && console.log(error.response.data.error)
    })
    };
}


export function submitUserWallPostReplyFetch(dispatch, token, postText) {
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
      dispatch(submitUserWallPostReplySuccess(response.data)) && console.log(response)
      //dispatch(getWallPostReplys(dispatch, token, '/api/posts'))
    })
    .catch(error => {
       dispatch(submitUserWallPostReplyFailure(error.response.data)) && console.log('ERROR ! ! !', error.response.data) && console.log('response, ', response)
    })
    };
}


export function submitWallPostReply(dispatch, token, postText, id) {
  var uri = `http://45.79.227.26/api/user/${id}/wall_post`
  return function (dispatch)  {
    console.log("Trying to DEBUG this axios POST request for submitting a wall post!!!", token, ", ", postText, ", ", id)
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
      //console.log('SUBMISSION SUCCESS, REPONSE:____________', response)
      dispatch(getWallPostReplies(dispatch, token, `/api/user/${id}/wall_posts`))
    })
    .catch(error => {
       dispatch(submitWallPostReplyFailure(error)) && console.error('ERROR ! ! !', error.response.data)
    })
    };
}

export function lessWallPostReplies() {
  return {
    type: LESS_WALL_POSTS,
  };
}

export function showWallPostReplyInput() {
  return {
    type: SHOW_WALL_POST_INPUT,
  };
}

export function hideWallPostReplyInput() {
  return {
    type: HIDE_WALL_POST_INPUT,
  };
}

export function getWallPostRepliesSuccess(data) {
  return {
    type: FETCH_WALL_POSTS_SUCCESS,
    payload: data
  };
}

export function getWallPostRepliesFailure(data) {
  return {
    type: FETCH_WALL_POSTS_FAILURE,
    payload: data.error
  };
}

export function getMoreWallPostRepliesSuccess(data) {
  return {
    type: FETCH_MORE_WALL_POSTS_SUCCESS,
    payload: data
  };
}

export function getMoreWallPostRepliesFailure(data) {
  return {
    type: FETCH_MORE_WALL_POSTS_FAILURE,
    payload: data.error
  };
}

export function submitWallPostReplySuccess(data) {
  return {
    type: SUBMIT_WALL_POST_SUCCESS,
    payload: data
  };
}

export function submitWallPostReplyFailure(data) {
  return {
    type: SUBMIT_WALL_POST_FAILURE,
    payload: data.error
  };
}

export function showReplyInput(id) {
  return {
    type: SHOW_REPLY_INPUT,
    payload: id
  };
}

export function hideReplyInput(id) {
  return {
    type: HIDE_REPLY_INPUT,
    payload: id
  };
}
