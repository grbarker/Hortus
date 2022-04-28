import axios from 'axios';

export const FETCH_OTHER_USER_GARDENS = 'FETCH_OTHER_USER_GARDENS';
export const FETCH_OTHER_USER_GARDENS_SUCCESS = 'FETCH_OTHER_USER_GARDENS_SUCCESS';
export const FETCH_OTHER_USER_GARDENS_FAILURE = 'FETCH_OTHER_USER_GARDENS_FAILURE';
export const FETCH_MORE_OTHER_USER_GARDENS_SUCCESS = 'FETCH_MORE_OTHER_USER_GARDENS_SUCCESS';
export const FETCH_MORE_OTHER_USER_GARDENS_FAILURE = 'FETCH_MORE_OTHER_USER_GARDENS_FAILURE';
export const LESS_OTHER_USER_GARDENS = 'LESS_OTHER_USER_GARDENS';

const api = "http://45.79.227.26/api/user/"

export function getOtherUserGardens(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://45.79.227.26' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of plants!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/user/plants')
      ? dispatch(getOtherUserGardensSuccess(response.data)) && console.log(response.data, 'GETTING FIRST SET OF GARDENS AGAIN AFTER A PLANT SUBMISSION')
      : (dispatch(getMoreOtherUserGardensSuccess(response.data)) && console.log('GETTING MORE GARDENS'))
    })
    .catch(error => {
       dispatch(getMoreOtherUserGardensFailure(error)) && console.log(error)
    })
    };
}


export function lessOtherUserGardens() {
  return {
    type: LESS_OTHER_USER_GARDENS,
  };
}

export function getOtherUserGardensSuccess(data) {
  return {
    type: FETCH_OTHER_USER_GARDENS_SUCCESS,
    payload: data
  };
}

export function getOtherUserGardensFailure(data) {
  return {
    type: FETCH_OTHER_USER_GARDENS_FAILURE,
    payload: data.error
  };
}

export function getMoreOtherUserGardensSuccess(data) {
  return {
    type: FETCH_MORE_OTHER_USER_GARDENS_SUCCESS,
    payload: data
  };
}

export function getMoreOtherUserGardensFailure(error) {
  return {
    type: FETCH_MORE_OTHER_USER_GARDENS_FAILURE,
    payload: error
  };
}
