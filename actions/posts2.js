import axios from 'axios';

//Get category
export const FETCH_POSTS = 'FETCH_POSTS';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';

const api = "http://45.79.227.26/api/posts/"

export function getPosts(dispatch, token, uri) {
  var uri = 'http://45.79.227.26' + uri
  return(dispatch) => {
    console.log("Trying to DEBUG this get request for the next set of posts!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}1`}
    })
    .then((response) => {
      console.log(response) && dispatch(getPostsSuccess(reponse))
    })
    .catch(error => {
      console.log(error.response.data.error) && dispatch(getPostsFailure(error.response.data))
    })
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
