import axios from 'axios';

export const FETCH_OTHER_USER_PLANTS = 'FETCH_OTHER_USER_PLANTS';
export const FETCH_OTHER_USER_PLANTS_SUCCESS = 'FETCH_OTHER_USER_PLANTS_SUCCESS';
export const FETCH_OTHER_USER_PLANTS_FAILURE = 'FETCH_OTHER_USER_PLANTS_FAILURE';
export const FETCH_MORE_OTHER_USER_PLANTS_SUCCESS = 'FETCH_MORE_OTHER_USER_PLANTS_SUCCESS';
export const FETCH_MORE_OTHER_USER_PLANTS_FAILURE = 'FETCH_MORE_OTHER_USER_PLANTS_FAILURE';
export const LESS_OTHER_USER_PLANTS = 'LESS_OTHER_USER_PLANTS';

const api = "http://34.221.120.52/api/user/"

export function getOtherUserPlants(dispatch, token, uri_end) {
  var uri_end = uri_end
  var uri = 'http://34.221.120.52' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of plants!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/user/plants')
      ? dispatch(getOtherUserPlantsSuccess(response.data)) && console.log(response.data, 'GETTING FIRST SET OF PLANTS AGAIN AFTER A PLANT SUBMISSION')
      : (dispatch(getMoreOtherUserPlantsSuccess(response.data)) && console.log('GETTING MORE PLANTS'))
    })
    .catch(error => {
       dispatch(getMoreOtherUserPlantsFailure(error)) && console.log(error)
    })
    };
}


export function lessOtherUserPlants() {
  return {
    type: LESS_OTHER_USER_PLANTS,
  };
}

export function getOtherUserPlantsSuccess(data) {
  return {
    type: FETCH_OTHER_USER_PLANTS_SUCCESS,
    payload: data
  };
}

export function getOtherUserPlantsFailure(data) {
  return {
    type: FETCH_OTHER_USER_PLANTS_FAILURE,
    payload: data.error
  };
}

export function getMoreOtherUserPlantsSuccess(data) {
  return {
    type: FETCH_MORE_OTHER_USER_PLANTS_SUCCESS,
    payload: data
  };
}

export function getMoreOtherUserPlantsFailure(error) {
  return {
    type: FETCH_MORE_OTHER_USER_PLANTS_FAILURE,
    payload: error
  };
}
