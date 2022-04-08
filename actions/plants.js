import axios from 'axios';

//Get category
export const FETCH_PLANTS = 'FETCH_PLANTS';
export const FETCH_PLANTS_SUCCESS = 'FETCH_PLANTS_SUCCESS';
export const FETCH_PLANTS_FAILURE = 'FETCH_PLANTS_FAILURE';
export const FETCH_MORE_PLANTS_SUCCESS = 'FETCH_PLANTS_SUCCESS';
export const FETCH_MORE_PLANTS_FAILURE = 'FETCH_PLANTS_FAILURE';
export const LESS_PLANTS = 'LESS_PLANTS';

const api = "http://34.221.120.52/api/plants/"

export function getPlants(dispatch, token, uri) {
  var uri_end = uri_end
  var uri = 'http://34.221.120.52' + uri_end
  return function (dispatch)  {
    console.log("Trying to DEBUG this get request for the next set of plants!!!", token, ", ", uri)
    axios.get(uri, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      (uri_end === '/api/plants')
      ? dispatch(getPlantsSuccess(response.data)) && console.log(response.data, 'GETTING FIRST SET OF PLANTS SUCCESS')
      : (dispatch(getMorePlantsSuccess(response.data)) && console.log('GETTING MORE PLANTS'))
    })
    .catch(error => {
       dispatch(getMorePlantsFailure(error)) && console.log(error)
    })
    };
}

export function lessPlants() {
  return {
    type: LESS_PLANTS,
  };
}

export function getPlantsSuccess(data) {
  return {
    type: FETCH_PLANTS_SUCCESS,
    payload: data
  };
}

export function getPlantsFailure(data) {
  return {
    type: FETCH_PLANTS_FAILURE,
    payload: data.error
  };
}

export function getMorePlantsSuccess(data) {
  return {
    type: FETCH_MORE_PLANTS_SUCCESS,
    payload: data
  };
}

export function getMorePlantsFailure(data) {
  return {
    type: FETCH_MORE_PLANTS_FAILURE,
    payload: data.error
  };
}
